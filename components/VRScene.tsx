import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

type Species = {
  color: THREE.Color;
  energy: number; // Add energy system
};

type Cell = {
  species: Species;
  age: number; // Track cell age for visual effects
  interactions: number; // Keep for stats
  phase: number; // 0.0 to 1.0 (Color Cycle Phase)
  direction: 1 | -1; // 1 = Towards White, -1 = Towards Black
  displayColor?: THREE.Color; // Stores the calculated prism color for this state
  isNewBorn: boolean; // Track if cell was just born
  isDying: boolean; // Track if cell is dying
};

// Rich medallion-inspired colors similar to SubsidiaryManager
// Rich neon HDR colors for Bloom effect
const speciesList: Species[] = [
  { color: new THREE.Color('#FF0055').multiplyScalar(1.5), energy: 1.5 }, // Neon Red
  { color: new THREE.Color('#00FFFF').multiplyScalar(1.5), energy: 1.4 }, // Cyan
  { color: new THREE.Color('#FFD700').multiplyScalar(1.5), energy: 1.2 }, // Gold
  { color: new THREE.Color('#FF00FF').multiplyScalar(1.5), energy: 1.3 }, // Magenta
  { color: new THREE.Color('#00FF00').multiplyScalar(1.5), energy: 1.5 }, // Lime
  { color: new THREE.Color('#7B68EE').multiplyScalar(1.5), energy: 1.1 }, // Medium Slate Blue
  { color: new THREE.Color('#FF4500').multiplyScalar(1.5), energy: 1.4 }, // Orange Red
  { color: new THREE.Color('#1E90FF').multiplyScalar(1.5), energy: 1.3 }, // Dodger Blue
];

interface VRSceneProps {
  onLoad?: () => void;
  isPaused: boolean;
  speed: number;
  visualMode: 'normal' | 'heat' | 'age';
  resetTrigger: number;
}



interface GameOfLifeTextureProps {
  isPaused: boolean;
  speed: number;
  visualMode: 'normal' | 'heat' | 'age';
  onGridReset: () => void;
  resetTrigger: number;
}

// Game of Life on cylinder surface - clean wrapping!
interface CylinderPoint {
  position: THREE.Vector3;
  cell: Cell | null;
  gridX: number;
  gridY: number;
}

const GameOfLifeTexture = ({ isPaused, speed, visualMode, onGridReset, resetTrigger }: GameOfLifeTextureProps) => {
  // Initialize mobile detection immediately to avoid texture recreation
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    }
    return false;
  });

  // Grid dimensions for cylinder surface - denser packing
  const gridWidth = isMobile ? 80 : 120; // Around the circumference - increased density
  const gridHeight = isMobile ? 80 : 120;  // Up the height - increased density
  const radius = 8;
  const height = 50; // Even taller cylinder

  // Create cylinder points using cylindrical coordinates
  const createCylinderPoints = (): CylinderPoint[] => {
    const points: CylinderPoint[] = [];

    // Add significant padding to keep dots and glow away from cylinder edges
    const verticalPadding = 6.0; // Keep dots 6 units away from top/bottom
    const usableHeight = height - (verticalPadding * 2);

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        // Convert to cylindrical coordinates with padding
        const angle = (x / gridWidth) * Math.PI * 2; // 0 to 2π around circumference
        const yPos = (y / (gridHeight - 1)) * usableHeight - usableHeight / 2; // Constrained within padded bounds

        const position = new THREE.Vector3(
          radius * Math.cos(angle),
          yPos,
          radius * Math.sin(angle)
        );

        points.push({
          position,
          cell: null,
          gridX: x,
          gridY: y
        });
      }
    }
    return points;
  };

  const [cylinderPoints, setCylinderPoints] = useState<CylinderPoint[]>(() => createCylinderPoints());
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  // Create static textures once (not on every render)
  const starTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    // Use smaller canvas size on mobile to avoid memory issues
    const size = isMobile ? 512 : 1024;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Safety check for canvas context (can fail on some mobile devices)
    if (!ctx) {
      console.warn('Canvas context failed, creating fallback texture');
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 64;
      fallbackCanvas.height = 64;
      const fallbackCtx = fallbackCanvas.getContext('2d');
      if (fallbackCtx) {
        fallbackCtx.fillStyle = '#1a1a3a';
        fallbackCtx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(fallbackCanvas);
    }

    const center = size / 2;

    try {
      // Create impressionist night sky with brushstroke-like gradient
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
      gradient.addColorStop(0, '#1a1a3a');
      gradient.addColorStop(0.5, '#0f0f2a');
      gradient.addColorStop(1, '#050515');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Reduce star count on mobile for better performance
      const starCount = isMobile ? 100 : 300;

      // Add impressionist stars with simplified rendering for mobile
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const starSize = isMobile ? (1 + Math.random() * 4) : (2 + Math.random() * 8);
        const brightness = 0.4 + Math.random() * 0.6;

        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = brightness;

        // Main star center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, starSize * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Simplified star rays for mobile
        if (!isMobile) {
          for (let ray = 0; ray < 4; ray++) {
            const angle = (ray / 4) * Math.PI * 2 + Math.random() * 0.5;
            const length = starSize * (0.8 + Math.random() * 0.4);

            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${brightness * 0.7})`;
            ctx.lineWidth = Math.max(1, starSize * 0.2);
            ctx.lineCap = 'round';
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
            ctx.stroke();
          }

          // Soft glow (desktop only for performance)
          const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, starSize * 1.5);
          glowGradient.addColorStop(0, `rgba(200, 220, 255, ${brightness * 0.3})`);
          glowGradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(0, 0, starSize * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    } catch (error) {
      console.warn('Canvas rendering failed, using simple background:', error);
      // Fallback to simple gradient if complex rendering fails
      ctx.fillStyle = '#1a1a3a';
      ctx.fillRect(0, 0, size, size);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    // Set texture wrapping and filtering for better mobile compatibility
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [isMobile]);

  const cloudTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    // Use smaller canvas size on mobile to avoid memory issues
    const size = isMobile ? 512 : 1024;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Safety check for canvas context (can fail on some mobile devices)
    if (!ctx) {
      console.warn('Canvas context failed for clouds, creating fallback texture');
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 64;
      fallbackCanvas.height = 64;
      const fallbackCtx = fallbackCanvas.getContext('2d');
      if (fallbackCtx) {
        fallbackCtx.fillStyle = '#87CEEB';
        fallbackCtx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(fallbackCanvas);
    }

    const center = size / 2;

    try {
      // Create impressionist sky background
      const skyGradient = ctx.createRadialGradient(center, center, 0, center, center, center);
      skyGradient.addColorStop(0, '#E6F3FF');
      skyGradient.addColorStop(0.3, '#B8E0FF');
      skyGradient.addColorStop(0.7, '#87CEEB');
      skyGradient.addColorStop(1, '#6BB6FF');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, size, size);

      // Reduce cloud count and complexity on mobile for better performance
      const cloudCount = isMobile ? 6 : 12;
      const maxStrokes = isMobile ? 4 : 8;

      // Add impressionist clouds with simplified brush stroke effects for mobile
      for (let cloud = 0; cloud < cloudCount; cloud++) {
        const cloudX = Math.random() * size;
        const cloudY = Math.random() * size;
        const cloudSize = isMobile ? (40 + Math.random() * 80) : (60 + Math.random() * 120);

        ctx.save();
        ctx.translate(cloudX, cloudY);

        // Create cloud with simplified brush strokes for mobile
        const strokeCount = maxStrokes + Math.random() * (isMobile ? 2 : 6);
        for (let stroke = 0; stroke < strokeCount; stroke++) {
          const strokeAngle = Math.random() * Math.PI * 2;
          const strokeDist = Math.random() * cloudSize * 0.7;
          const strokeX = Math.cos(strokeAngle) * strokeDist;
          const strokeY = Math.sin(strokeAngle) * strokeDist;
          const strokeSize = cloudSize * (0.3 + Math.random() * 0.4);

          if (isMobile) {
            // Simplified rendering for mobile - just solid circles
            ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.arc(strokeX, strokeY, strokeSize, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Full gradient rendering for desktop
            const brushGradient = ctx.createRadialGradient(
              strokeX, strokeY, 0,
              strokeX, strokeY, strokeSize
            );
            brushGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            brushGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.7)');
            brushGradient.addColorStop(0.8, 'rgba(240, 248, 255, 0.4)');
            brushGradient.addColorStop(1, 'rgba(240, 248, 255, 0)');

            ctx.fillStyle = brushGradient;
            ctx.beginPath();
            ctx.arc(strokeX, strokeY, strokeSize, 0, Math.PI * 2);
            ctx.fill();

            // Add some texture with smaller strokes (desktop only)
            for (let detail = 0; detail < 3; detail++) {
              const detailAngle = Math.random() * Math.PI * 2;
              const detailDist = Math.random() * strokeSize * 0.5;
              const detailX = strokeX + Math.cos(detailAngle) * detailDist;
              const detailY = strokeY + Math.sin(detailAngle) * detailDist;
              const detailSize = strokeSize * (0.2 + Math.random() * 0.3);

              ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`;
              ctx.beginPath();
              ctx.arc(detailX, detailY, detailSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        ctx.restore();
      }
    } catch (error) {
      console.warn('Cloud canvas rendering failed, using simple background:', error);
      // Fallback to simple gradient if complex rendering fails
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, size, size);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    // Set texture wrapping and filtering for better mobile compatibility
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [isMobile]);

  // Create circular point texture with bright glow
  const circleTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    // Use smaller texture size on mobile to reduce memory usage
    const size = isMobile ? 64 : 128;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Safety check for canvas context (can fail on some mobile devices)
    if (!ctx) {
      console.warn('Canvas context failed for circle texture, creating fallback');
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 32;
      fallbackCanvas.height = 32;
      const fallbackCtx = fallbackCanvas.getContext('2d');
      if (fallbackCtx) {
        // Simple white circle fallback
        fallbackCtx.fillStyle = 'white';
        fallbackCtx.beginPath();
        fallbackCtx.arc(16, 16, 12, 0, Math.PI * 2);
        fallbackCtx.fill();
      }
      return new THREE.CanvasTexture(fallbackCanvas);
    }

    const center = size / 2;

    try {
      if (isMobile) {
        // Enhanced mobile rendering - brighter and more defined
        // Solid core for better visibility
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.beginPath();
        ctx.arc(center, center, center * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Bright glow ring
        const mobileGradient = ctx.createRadialGradient(center, center, center * 0.4, center, center, center);
        mobileGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        mobileGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
        mobileGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.4)');
        mobileGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = mobileGradient;
        ctx.beginPath();
        ctx.arc(center, center, center, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Full quality rendering for desktop
        // Create bright glow outer ring
        const outerGlow = ctx.createRadialGradient(center, center, 0, center, center, center);
        outerGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
        outerGlow.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)');
        outerGlow.addColorStop(0.6, 'rgba(255, 255, 255, 0.6)');
        outerGlow.addColorStop(0.8, 'rgba(255, 255, 255, 0.3)');
        outerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(center, center, center, 0, Math.PI * 2);
        ctx.fill();

        // Add bright center core
        const coreGradient = ctx.createRadialGradient(center, center, 0, center, center, center * 0.3125); // 20/64 ratio
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        coreGradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
        coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(center, center, center * 0.3125, 0, Math.PI * 2);
        ctx.fill();
      }
    } catch (error) {
      console.warn('Circle texture rendering failed, using simple fallback:', error);
      // Fallback to simple white circle
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(center, center, center * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    // Set texture wrapping and filtering for better mobile compatibility
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [isMobile]);

  // Initialize with clusters
  useEffect(() => {
    const points = createCylinderPoints();
    console.log(`Initializing Game of Life - Mobile: ${isMobile}, Grid: ${gridWidth}x${gridHeight}, Points: ${points.length}`);

    // Create several distinct clusters for different species
    speciesList.forEach((species, i) => {
      const numClusters = 2 + Math.floor(Math.random() * 3); // 2-4 clusters per species

      for (let cluster = 0; cluster < numClusters; cluster++) {
        // Random cluster centers
        const clusterY = Math.floor(Math.random() * gridHeight);
        const clusterX = Math.floor(Math.random() * gridWidth);
        const clusterSize = 4 + Math.floor(Math.random() * 6); // 4-9 radius

        for (let y = clusterY - clusterSize; y <= clusterY + clusterSize; y++) {
          for (let x = clusterX - clusterSize; x <= clusterX + clusterSize; x++) {
            const wrappedY = Math.max(0, Math.min(gridHeight - 1, y));
            const wrappedX = (x + gridWidth) % gridWidth; // Wrap around cylinder
            const index = wrappedY * gridWidth + wrappedX;

            const distance = Math.sqrt((y - clusterY) ** 2 + (x - clusterX) ** 2);
            if (index < points.length && distance <= clusterSize && Math.random() > 0.3) {
              // Initialize with species color directly - NOT white
              // This prevents the "all white" problem
              points[index].cell = {
                species: { color: species.color.clone(), energy: species.energy },
                age: Math.floor(Math.random() * 10),
                interactions: 0,
                phase: 0.5, // Start at midpoint (Bold Color)
                direction: -1, // Start fading towards black
                displayColor: species.color.clone(), // START AT SPECIES COLOR
                isNewBorn: false,
                isDying: false
              };
            }
          }
        }
      }
    });

    setCylinderPoints(points);

    // Log initial cell count for debugging
    const initialCellCount = points.filter(p => p.cell !== null).length;
    console.log(`Initial cells created: ${initialCellCount} out of ${points.length} total points`);
  }, [resetTrigger, isMobile, gridWidth, gridHeight]);

  // Mobile detection is now handled in useState initializer to prevent texture recreation

  // Find neighbors using proper 2D grid coordinates on cylinder
  const findCylinderNeighbors = (pointIndex: number): number[] => {
    const point = cylinderPoints[pointIndex];
    if (!point) return [];

    const x = point.gridX;
    const y = point.gridY;
    const neighbors: number[] = [];

    // Check 8 neighbors in 2D grid (with cylinder wrapping)
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        // Handle wrapping around cylinder
        let newY = y + dy;
        let newX = (x + dx + gridWidth) % gridWidth; // Wrap around circumference

        // Handle top/bottom boundaries (no wrapping at ends)
        if (newY < 0 || newY >= gridHeight) {
          continue; // Skip neighbors beyond cylinder ends
        }

        // Convert back to array index
        const neighborIndex = newY * gridWidth + newX;
        if (neighborIndex >= 0 && neighborIndex < cylinderPoints.length && neighborIndex !== pointIndex) {
          neighbors.push(neighborIndex);
        }
      }
    }

    return neighbors;
  };

  // Update cylinder points using Game of Life rules
  const updateCylinderPoints = (): CylinderPoint[] => {
    return cylinderPoints.map((point, index) => {
      const neighbors = findCylinderNeighbors(index);
      const neighborCells = neighbors.map(i => cylinderPoints[i].cell).filter(Boolean) as Cell[];
      const neighborCount = neighborCells.length;

      if (point.cell) {
        // Current cell exists - check survival
        if (neighborCount < 2 || neighborCount > 3) {
          // Dies from loneliness or overcrowding
          return { ...point, cell: null };
        } else {
          // Survives - age and possibly evolve
          const currentCell = point.cell;
          const species = currentCell.species;

          // --- PRISM STATE EVOLUTION ---
          // "Each cell should have a starting color that changes in step with the steps of the game"
          const currentColor = currentCell.displayColor || new THREE.Color(1, 1, 1);
          let nextDir = currentCell.direction;

          // AGE-BASED STABILITY
          // "Static structures still see their dots evolving... should not be happening."
          // Cells that interact/move have low age (cycles of birth/death).
          // Cells in static blocks have high age.
          // Rule: As Age increases, the cell resists "Rebound" and settles into "Bold".

          const isStable = currentCell.age > 10;

          // 1. Determine Direction (Neighbor Pressure)
          // "If two cells are close to 1 (white), they should subtract"
          const brightness = (currentColor.r + currentColor.g + currentColor.b) / 3;

          // Count bright neighbors to trigger "Destructive Interference"
          const brightNeighbors = neighborCells.filter(n => {
            const c = n.displayColor || n.species.color;
            return (c.r + c.g + c.b) / 3 > 0.7;
          }).length;

          if (brightness > 0.7 && brightNeighbors > 0) {
            // Forced Decay due to crowding interaction
            nextDir = -1;
          }
          else if (brightness < 0.05) {
            // "Literally go to black... and then reverse"
            // Only rebound if NOT stable. Stable cells fade to black and stay? 
            // Or stay Bold? 
            // If static structures shouldn't evolve, they should probably stabilize at Species Color.
            // So we don't let them hit black.
            if (!isStable) {
              nextDir = 1;
            }
          }

          // 2. Apply Prism Color Evolution
          // "Start off really light... color gets more intense... until black"

          // Weights: Species color defines the "Path".
          // Strong channels fade slow, Weak channels fade fast.
          const wR = species.color.r;
          const wG = species.color.g;
          const wB = species.color.b;

          // Aggressive Step Size to prevent "staying primarily white"
          const baseStep = 0.25;

          let dR = 0, dG = 0, dB = 0;

          if (nextDir === -1) {
            // DECAY (Towards Black)
            // Weak channels (low w) should drop FAST.
            // Strong channels (high w) should drop SLOW.
            // Formula: -Step * (1.1 - w). 
            // If w=1, decay = 0.1 * Step. If w=0, decay = 1.1 * Step.
            dR = -baseStep * (1.1 - wR);
            dG = -baseStep * (1.1 - wG);
            dB = -baseStep * (1.1 - wB);
          } else {
            // GROWTH (Towards White) - The "Reverse" process
            // Strong channels fill first? Or keep "Prism" effect?
            // To maintain color during growth, Strong grow faster.
            dR = baseStep * (0.8 + wR);
            dG = baseStep * (0.8 + wG);
            dB = baseStep * (0.8 + wB);
          }

          // Apply Delta
          const nextColor = new THREE.Color(
            Math.max(0, Math.min(1, currentColor.r + dR)),
            Math.max(0, Math.min(1, currentColor.g + dG)),
            Math.max(0, Math.min(1, currentColor.b + dB))
          );

          // STABILITY OVERRIDE
          // If the cell is stable (Age > 10), we force it to settle.
          // But "stay color" not "stay white".
          // We blend it towards the pure Species Color to lock it in "Bold".
          if (isStable) {
            // Slowly lerp to pure species color, stopping the "White -> Black" cycle.
            nextColor.lerp(species.color, 0.2);
            // Ensure it doesn't get stuck in Black if it was midpoint
            // ThreeJS Color doesn't have .length(), so we check brightness
            const brightness = (nextColor.r + nextColor.g + nextColor.b) / 3;
            if (brightness < 0.1) nextColor.lerp(species.color, 0.5);
          }

          const newCell = {
            ...point.cell,
            age: point.cell.age + 1,
            interactions: point.cell.interactions + 1,
            phase: 0,
            direction: nextDir,
            displayColor: nextColor,
            isNewBorn: false,
            isDying: false
          };

          return { ...point, cell: newCell };
        }
      } else {
        // Empty cell - check for birth
        if (neighborCount === 3) {
          // Birth - Start at PARENT COLOR (blended from neighbors)
          let parentColorSum = new THREE.Color(0, 0, 0);
          neighborCells.forEach(c => parentColorSum.add(c.species.color));
          parentColorSum.multiplyScalar(1 / 3);

          return {
            ...point,
            cell: {
              species: { color: parentColorSum.clone(), energy: 1.0 },
              age: 0,
              interactions: 0,
              phase: 0.5, // Start at midpoint (Bold)
              direction: -1, // Start fading towards black
              displayColor: parentColorSum.clone(), // START AT SPECIES COLOR
              isNewBorn: true,
              isDying: false
            }
          };
        } else if (Math.random() > 0.9995) {
          // Spontaneous generation - random species color
          const randomSpecies = speciesList[Math.floor(Math.random() * speciesList.length)];
          return {
            ...point,
            cell: {
              species: { color: randomSpecies.color.clone(), energy: 1.0 },
              age: 0,
              interactions: 0,
              phase: 0.5, // Start at midpoint
              direction: -1,
              displayColor: randomSpecies.color.clone(), // START AT SPECIES COLOR
              isNewBorn: true,
              isDying: false
            }
          };
        }
      }
      return point;
    });
  };

  // Refs for sky element animations and points
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    // Rotate the entire cylinder slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = elapsedTime * 0.05;
    }

    // Game of Life animation (controlled by user speed)
    if (!isPaused && elapsedTime - lastUpdateTime > speed) {
      const newPoints = updateCylinderPoints();
      setCylinderPoints(newPoints);
      setLastUpdateTime(elapsedTime);
    }

    // Update point rendering efficiently
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;

      cylinderPoints.forEach((point, i) => {
        const i3 = i * 3;

        // Position
        positions[i3] = point.position.x;
        positions[i3 + 1] = point.position.y;
        positions[i3 + 2] = point.position.z;

        // Color based on cell and visual mode
        if (point.cell) {
          // Visual Mode logic
          // 'normal' mode now uses the State-Bound displayColor we calculated in the tick.
          let color;

          if (visualMode === 'normal') {
            // Use pre-calculated state color
            color = point.cell.displayColor ? point.cell.displayColor.clone() : point.cell.species.color.clone();
          } else if (visualMode === 'heat') {
            const energy = point.cell.species.energy;
            const hue = Math.max(0, Math.min(0.7, 0.7 - ((energy - 0.5) * 0.8)));
            color = new THREE.Color().setHSL(hue, 0.9, 0.6);
          } else {
            // Age
            const ageRatio = Math.min(point.cell.age / 50, 1);
            color = point.cell.species.color.clone().lerp(new THREE.Color('white'), ageRatio * 0.5);
          }

          const multiplier = isMobile ? 3.5 : 2.5; // Significantly brighter for visibility
          const enhancedColor = color.clone().multiplyScalar(multiplier);
          colors[i3] = Math.min(1.0, enhancedColor.r);
          colors[i3 + 1] = Math.min(1.0, enhancedColor.g);
          colors[i3 + 2] = Math.min(1.0, enhancedColor.b);
        } else {
          // Make empty cells completely invisible - no alpha, no color
          colors[i3] = 0;
          colors[i3 + 1] = 0;
          colors[i3 + 2] = 0;
        }
      });

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }

    // Update connection lines efficiently
    if (linesRef.current) {
      const linePositions: number[] = [];
      const lineColors: number[] = [];

      // Reduce line rendering frequency on mobile for better performance
      const skipFactor = isMobile ? 4 : 4; // Same skip rate for consistent visibility
      cylinderPoints.forEach((point, index) => {
        if (!point.cell || index % skipFactor !== 0) return;

        const neighbors = findCylinderNeighbors(index);
        neighbors.forEach(neighborIndex => {
          const neighbor = cylinderPoints[neighborIndex];
          if (neighbor?.cell && neighborIndex > index) { // Avoid duplicate lines
            // Add line segment (two points)
            linePositions.push(
              point.position.x, point.position.y, point.position.z,
              neighbor.position.x, neighbor.position.y, neighbor.position.z
            );

            // Blend colors for the line - much brighter
            const lineMultiplier = isMobile ? 1.8 : 1.2; // Moderately brighter lines on mobile
            const blendedColor = point.cell!.species.color.clone()
              .lerp(neighbor.cell.species.color, 0.5)
              .multiplyScalar(lineMultiplier);

            // Add color for both points of the line segment
            lineColors.push(
              blendedColor.r, blendedColor.g, blendedColor.b,
              blendedColor.r, blendedColor.g, blendedColor.b
            );
          }
        });
      });

      // Update line geometry
      if (linePositions.length > 0) {
        const geometry = linesRef.current.geometry;
        const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
        const colAttr = geometry.getAttribute('color') as THREE.BufferAttribute;

        if (posAttr && posAttr.array.length >= linePositions.length) {
          // Update existing buffer in-place
          (posAttr.array as Float32Array).set(linePositions);
          posAttr.needsUpdate = true;

          if (colAttr) {
            (colAttr.array as Float32Array).set(lineColors);
            colAttr.needsUpdate = true;
          }
          // Limit draw to actual vertex count
          geometry.setDrawRange(0, linePositions.length / 3);
        } else {
          // Recreate buffer if too small
          geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
          geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineColors), 3));
          geometry.setDrawRange(0, linePositions.length / 3);
        }
      } else {
        linesRef.current.geometry.setDrawRange(0, 0);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Mobile gradient backdrop for contrast - non-blocking */}
      {isMobile && (
        <mesh position={[0, 0, -20]} renderOrder={-5}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Dynamic Connections Mesh */}
      <lineSegments ref={linesRef} renderOrder={0}>
        <bufferGeometry>
          {/* Initialize with a reasonable size buffer so we don't reallocate constantly */}
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(3000 * 3), 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[new Float32Array(3000 * 3), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={isMobile ? 0.6 : 0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Large Starfield Environment */}
      <mesh renderOrder={-10}>
        <sphereGeometry args={[100, 64, 64]} />
        <meshBasicMaterial
          map={starTexture}
          side={THREE.BackSide}
          transparent={false}
          fog={false}
        />
      </mesh>

      {/* High-performance point-based rendering */}
      <points ref={pointsRef} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(cylinderPoints.length * 3), 3]}
            count={cylinderPoints.length}
            array={new Float32Array(cylinderPoints.length * 3)}
            itemSize={3}
            usage={THREE.DynamicDrawUsage}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[new Float32Array(cylinderPoints.length * 3), 3]}
            count={cylinderPoints.length}
            array={new Float32Array(cylinderPoints.length * 3)}
            itemSize={3}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <pointsMaterial
          map={circleTexture}
          size={isMobile ? 0.35 : 0.25}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          alphaTest={0.01}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

// VR Scene Component
const VRScene: React.FC<VRSceneProps> = ({ onLoad, isPaused, speed, visualMode, resetTrigger }) => {
  // Mobile detection for lighting adjustments
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    }
    return false;
  });

  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 35, 0], fov: 75, up: [0, 0, -1] }}>
        <color attach="background" args={['#000000']} />
        {/* Minimal ambient light for Game of Life sprites only */}
        <ambientLight intensity={0.1} />

        {/* Targeted spotlights for sky elements - don't affect cylinder */}
        <spotLight
          position={[0, -40, 0]}
          target-position={[0, -31, 0]}
          angle={Math.PI / 3}
          penumbra={0.5}
          intensity={1.0}
          color="#ffffff"
          distance={30}
        />
        <spotLight
          position={[0, 40, 0]}
          target-position={[0, 31, 0]}
          angle={Math.PI / 3}
          penumbra={0.5}
          intensity={1.0}
          color="#ffffff"
          distance={30}
        />

        {/* Gentle directional light for sprite definition */}
        <directionalLight position={[15, 15, 15]} intensity={0.3} />
        <OrbitControls />
        <GameOfLifeTexture
          isPaused={isPaused}
          speed={speed}
          visualMode={visualMode}
          // We don't need to pass a callback if we pass the trigger directly
          onGridReset={() => { }}
          resetTrigger={resetTrigger}
        />
        <EffectComposer enableNormalPass={false}>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} radialModulation={false} modulationOffset={0} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default VRScene;

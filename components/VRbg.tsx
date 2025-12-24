'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import VRScene from './VRScene';
import PortalHUD from './PortalHUD';
import AnalyzePanel from './Analyze';
import Directory from './Directory';
import Mythology from './Mythology';
import Principles from "./Principles";
import Chatbot from './Chatbot';
import LearnPanel from './Learn';
import SubsidiaryManager from './SubsidiaryManager';
import ShopifyStorefront from './ShopifyStorefront';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

export default function VRBackground() {
  const [currentView, setCurrentView] = useState('Diamond Viewer');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Scene State
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(0.1);
  const [visualMode, setVisualMode] = useState<'normal' | 'heat' | 'age'>('normal');
  const [gridResetTrigger, setGridResetTrigger] = useState(0);
  const [hudOpen, setHudOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrambledText, setScrambledText] = useState('SHOP');

  // Text scrambling effect
  const scrambleText = useCallback((fromText: string, toText: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const steps = 8;
    const stepDuration = 50;

    let currentStep = 0;
    const scrambleInterval = setInterval(() => {
      if (currentStep >= steps) {
        setScrambledText(toText);
        clearInterval(scrambleInterval);
        return;
      }

      const progress = currentStep / steps;
      let result = '';

      for (let i = 0; i < Math.max(fromText.length, toText.length); i++) {
        if (i < toText.length && Math.random() < progress) {
          result += toText[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setScrambledText(result);
      currentStep++;
    }, stepDuration);
  }, []);

  const handleShopToggle = useCallback(() => {
    if (shopOpen) {
      scrambleText('CLOSE', 'SHOP');
    } else {
      scrambleText('SHOP', 'CLOSE');
    }
    setShopOpen(!shopOpen);
  }, [shopOpen, scrambleText]);

  // Chatbot State
  const [messages, setMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [optionsVisible, setOptionsVisible] = useState(true);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio('/TheGameOfLife.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'Diamond Viewer':
        return <AnalyzePanel />;
      case 'Chat':
        return (
          <div className="absolute inset-x-0 top-0 bottom-[120px] flex items-center justify-center px-4 pt-20 pointer-events-none">
            <div className="w-full h-full max-w-[95vw] pointer-events-auto">
              <Chatbot
                messages={messages}
                setMessages={setMessages}
                input={input}
                setInput={setInput}
                optionsVisible={optionsVisible}
                setOptionsVisible={setOptionsVisible}
              />
            </div>
          </div>
        );
      case 'Directory':
        return (
          <div className="absolute inset-x-0 top-0 bottom-[120px] flex items-center justify-center px-4 pt-20 pointer-events-none">
            <div className="w-full h-full max-w-[98vw] overflow-hidden pointer-events-auto">
              <Directory />
            </div>
          </div>
        );
      case 'Mythology':
        return (
          <div className="absolute inset-x-0 top-0 bottom-[120px] flex items-center justify-center px-4 pt-20 pointer-events-none">
            <div className="w-full h-full max-w-[95vw] overflow-auto pointer-events-auto">
              <Mythology />
            </div>
          </div>
        );
      case 'Principles':
        // Principles has its own full-screen fixed positioning
        return <Principles />;
      case 'Learn':
        return (
          <div className="absolute inset-x-0 top-0 bottom-[120px] flex items-center justify-center px-4 pt-20 pointer-events-none">
            <div className="w-full h-full max-w-[95vw] overflow-auto pointer-events-auto">
              <LearnPanel />
            </div>
          </div>
        );
      case 'Buy':
        return (
          <div className="absolute inset-x-0 top-0 bottom-[120px] flex items-center justify-center px-4 pt-20 pointer-events-none">
            <div className="w-full h-full max-w-[95vw] overflow-auto pointer-events-auto">
              <SubsidiaryManager />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* HUD Navigation */}
      <PortalHUD
        onNavigate={(view) => {
          if (currentView === view) {
            setCurrentView(''); // Toggle off if clicking the same view
          } else {
            setCurrentView(view);
          }
        }}
        currentView={currentView}
      />

      {/* Music Control */}
      <button
        onClick={toggleMusic}
        className="fixed z-[2000] rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto
          top-20 left-1/2 -translate-x-1/2 p-2 
          md:top-auto md:left-auto md:translate-x-0 md:bottom-8 md:right-8 md:p-3"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(245, 64, 41, 0.3)',
        }}
        title="Toggle Background Music"
      >
        {isPlaying ? (
          <SpeakerWaveIcon className="w-4 h-4 md:w-6 md:h-6 text-[#F54029]" />
        ) : (
          <SpeakerXMarkIcon className="w-4 h-4 md:w-6 md:h-6 text-[#F54029]/50" />
        )}
      </button>

      {/* VR Scene Background */}
      <div className="absolute inset-0 z-0 select-none">
        <VRScene
          onLoad={() => setIsLoaded(true)}
          isPaused={isPaused}
          speed={speed}
          visualMode={visualMode}
          resetTrigger={gridResetTrigger}
        />
      </div>

      {/* Settings Tab */}
      <div
        onClick={() => setHudOpen(!hudOpen)}
        className={`pointer-events-auto fixed z-[3000] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-out border border-l-0 border-[#F54029]/30 rounded-r-md bg-[#050a14]/40 backdrop-blur-xl shadow-[0_4px_16px_rgba(245,64,41,0.1)] text-[#F54029] text-xs
          ${hudOpen ? 'left-[250px]' : 'left-0'}
          w-6 h-20 top-[45%] -translate-y-1/2 md:top-[45%]
          hover:opacity-80
        `}
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm leading-none font-bold">
            {hudOpen ? '×' : '→'}
          </div>
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 -rotate-90 text-[10px] tracking-widest font-bold opacity-90 whitespace-nowrap font-mono">
            {hudOpen ? 'CLOSE' : 'SETTINGS'}
          </div>
        </div>
      </div>

      {/* Shop Tab */}
      <div
        onClick={handleShopToggle}
        className="pointer-events-auto"
        style={{
          position: 'absolute',
          left: '0px',
          top: '55%',
          transform: 'translateY(-50%)',
          width: '24px',
          height: '80px',
          background: 'rgba(5, 10, 20, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(245, 64, 41, 0.3)',
          borderLeft: 'none',
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 3000,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '12px',
          color: '#F54029',
          boxShadow: '0 4px 16px rgba(245, 64, 41, 0.1)',
        }}
      >
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%'
        }}>
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '14px',
            lineHeight: '1',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
            {hudOpen ? '×' : '→'}
          </div>
          <div style={{
            position: 'absolute',
            bottom: '27px',
            left: '50%',
            transform: 'translateX(-50%) rotate(-90deg)',
            fontSize: '10px',
            letterSpacing: '1px',
            fontWeight: 'bold',
            opacity: 0.9,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            fontFamily: 'monospace'
          }}>
            {hudOpen ? 'CLOSE' : 'SETTINGS'}
          </div>
        </div>
      </div>

      {/* Shop Tab */}
      <div
        onClick={handleShopToggle}
        className={`pointer-events-auto fixed z-[3000] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-out border border-l-0 border-[#F54029]/30 rounded-r-md bg-[#050a14]/40 backdrop-blur-xl shadow-[0_4px_16px_rgba(245,64,41,0.1)] text-[#F54029] text-xs
          left-0
          w-6 h-20 top-[55%] -translate-y-1/2
          hover:opacity-80
        `}
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm leading-none font-bold">
            {shopOpen ? '×' : '→'}
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 -rotate-90 text-[10px] tracking-widest font-bold opacity-90 whitespace-nowrap font-mono">
            {scrambledText}
          </div>
        </div>
      </div>

      {/* Control Panel (Settings Drawer) */}
      <div
        className="pointer-events-auto"
        style={{
          position: 'absolute',
          left: hudOpen ? '0px' : '-250px',
          top: '0px',
          width: '250px',
          height: '100vh',
          background: 'rgba(5, 10, 20, 0.6)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          borderRight: '1px solid rgba(245, 64, 41, 0.2)',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: '14px',
          zIndex: 2999, // Just below the toggle tab
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: '25px 20px',
          boxSizing: 'border-box',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#F54029',
          letterSpacing: '0.1em'
        }}>
          GAME.OF.LIFE
        </div>

        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setIsPaused(!isPaused)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: isPaused
                ? 'rgba(76, 175, 80, 0.2)'
                : 'rgba(245, 64, 41, 0.2)',
              border: `1px solid ${isPaused ? '#4caf50' : '#F54029'}`,
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            {isPaused ? '► RESUME_SIM' : '‖ PAUSE_SIM'}
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setGridResetTrigger(prev => prev + 1)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            ↻ RESET_GRID
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ marginBottom: '6px', fontSize: '10px', color: '#F54029', fontWeight: 'bold', letterSpacing: '0.1em' }}>VISUAL.MODE</div>
          <select
            value={visualMode}
            onChange={(e) => setVisualMode(e.target.value as 'normal' | 'heat' | 'age')}
            style={{
              width: '100%',
              padding: '8px 10px',
              background: 'rgba(5, 10, 20, 0.8)',
              border: '1px solid rgba(245, 64, 41, 0.3)',
              borderRadius: '4px',
              color: 'white',
              fontSize: '12px',
              fontFamily: 'monospace',
              outline: 'none'
            }}
          >
            <option value="normal">◆ NORMAL</option>
            <option value="heat">▲ HEATMAP</option>
            <option value="age">◐ AGE</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{
            marginBottom: '6px',
            fontSize: '10px',
            color: '#F54029',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>SIM.SPEED</span>
            <span style={{ color: 'white' }}>
              {Math.round(((0.5 - speed) / (0.5 - 0.01)) * 99 + 1)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={Math.round(((0.5 - speed) / (0.5 - 0.01)) * 99 + 1)}
            onChange={(e) => {
              const percentage = parseFloat(e.target.value);
              const newSpeed = 0.5 - ((percentage - 1) / 99) * (0.5 - 0.01);
              setSpeed(newSpeed);
            }}
            style={{
              width: '100%',
              height: '4px',
              background: 'rgba(245, 64, 41, 0.3)',
              borderRadius: '2px',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none'
            }}
          />
        </div>

        <div style={{
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.5)',
          marginTop: '20px',
          lineHeight: '1.6',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '15px'
        }}>
          <div>● Active Nodes</div>
          <div>◈ Neural Connections</div>
          <div>※ Real-time Sim</div>
        </div>
      </div>

      {/* Shopify Storefront */}
      <ShopifyStorefront
        isVisible={shopOpen}
        onClose={() => setShopOpen(false)}
      />



      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-[5000] flex items-center justify-center bg-black">
          <div className="text-[#F54029] font-mono animate-pulse tracking-widest text-xl">
            INITIALIZING_PORTAL...
          </div>
        </div>
      )}

      {/* Main Content Overlay */}
      {renderView()}

    </div>
  );
}

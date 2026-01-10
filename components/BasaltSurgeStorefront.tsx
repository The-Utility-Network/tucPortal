'use client';

import React, { useEffect, useState } from 'react';
import { getBasaltInventory, BasaltItem } from '../src/app/actions/basalt';

interface BasaltSurgeStorefrontProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function BasaltSurgeStorefront({ isVisible, onClose }: BasaltSurgeStorefrontProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState<BasaltItem[]>([]);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Track if component has ever been visible for smooth animations
    useEffect(() => {
        if (isVisible && !hasBeenVisible) {
            setHasBeenVisible(true);
            fetchInventory();
        }
    }, [isVisible, hasBeenVisible]);

    const fetchInventory = async () => {
        setIsLoading(true);
        setError(null); // Reset error state on new attempt
        try {
            const { items: fetchedItems, error: fetchError } = await getBasaltInventory();
            if (fetchError) {
                setError(fetchError);
            } else {
                setItems(fetchedItems);
            }
        } catch (err) {
            setError('Failed to load inventory');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render until first time visible (for smooth slide-in animation)
    if (!hasBeenVisible && !isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex"
            style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
        >
            {/* Backdrop - lighter for better visibility of VR scene */}
            {isVisible && (
                <div
                    className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-all duration-500"
                    onClick={onClose}
                    style={{ zIndex: 10 }}
                />
            )}

            {/* Header - Glassy and Sleek */}
            <div
                className={`fixed left-0 right-0 flex items-center px-4 md:px-8 py-2 md:py-4 w-full transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-[200%]'
                    }`}
                style={{
                    top: '80px', // Below main navbar
                    height: 'auto',
                    minHeight: '80px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    zIndex: 50,
                    justifyContent: 'center'
                }}
            >
                <div className="flex items-center space-x-3 md:space-x-4 max-w-full overflow-hidden">
                    <div className="relative group flex-shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                        <img src="/Medallions/TUC.png" alt="TUC Store" className="relative h-10 w-10 md:h-12 md:w-12 rounded-full shadow-2xl ring-1 ring-white/20" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h2 className="text-lg md:text-2xl font-bold text-white tracking-wide truncate" style={{
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                            fontFamily: 'var(--font-rajdhani), sans-serif',
                        }}>THE UTILITY CO. <span className="text-[#F54029]">STORE</span></h2>
                        <a
                            href="https://surge.basalthq.com/shop/utilityco"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] md:text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-1 truncate"
                            style={{ letterSpacing: '1px' }}
                        >
                            POWERED BY BASALT SURGE <span className="text-[10px] opacity-70">↗</span>
                        </a>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute right-4 md:right-8 p-2 rounded-full hover:bg-white/10 transition-colors group z-50 bg-black/20 md:bg-transparent backdrop-blur-md md:backdrop-blur-none"
                    aria-label="Close Store"
                >
                    <span className="text-white/80 group-hover:text-white text-2xl font-thin leading-none block">&times;</span>
                </button>
            </div>

            {/* Slideout Panel - Maximum Transparency */}
            <div className={`fixed inset-0 top-0 left-0 h-full w-full transition-transform duration-500 ease-out ${isVisible ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{
                    transform: isVisible ? 'translateX(0)' : 'translateX(-100%)', // Slide in from left
                    background: 'transparent',
                    zIndex: 40
                }}>

                {/* Visual Background Layer for Glass Effect */}
                <div className="absolute inset-0 w-full h-full" style={{
                    background: 'rgba(0, 0, 0, 0.4)', // Dark but see-through
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    // No border, just full screen immersion
                }}></div>

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className="flex flex-col items-center space-y-4 p-8 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F54029]"></div>
                            <p className="text-white font-mono text-sm tracking-widest">ACCESSING_INVENTORY...</p>
                        </div>
                    </div>
                )}

                {/* Content Container */}
                <div
                    className="relative w-full h-full overflow-y-auto custom-scrollbar"
                    style={{
                        paddingTop: '180px', // Provide space for the header
                        scrollBehavior: 'smooth',
                        paddingBottom: '100px'
                    }}
                >
                    <div className="max-w-[1600px] mx-auto px-4 md:px-6 pb-20 md:pb-32">
                        {error && (
                            <div className="w-full text-center p-8 bg-red-900/20 rounded-xl border border-red-500/30 text-white backdrop-blur-md mx-auto max-w-2xl mt-10">
                                <p className="text-xl mb-2">⚠️ CONNECTION_ERROR</p>
                                <p className="text-sm opacity-70 mb-6">{error}</p>
                                <button
                                    onClick={fetchInventory}
                                    className="px-6 py-2 bg-[#F54029] hover:bg-[#d43622] rounded text-white font-bold tracking-wider transition-all text-sm"
                                >
                                    RETRY_CONNECTION
                                </button>
                            </div>
                        )}

                        {!isLoading && !error && items.length === 0 && (
                            <div className="w-full text-center p-20 text-white opacity-50 font-mono">
                                <p>NO_ITEMS_DETECTED_IN_SECTOR</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col rounded-xl overflow-hidden group relative transition-all duration-300 hover:-translate-y-1 bg-white/5 border border-white/10 hover:border-white/20 shadow-lg"
                                    style={{
                                        // Removed inline styles in favor of classes for better responsiveness
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    }}
                                >
                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                    {/* Image Area */}
                                    <div className="relative aspect-square w-full overflow-hidden bg-black/20 group-hover:bg-black/40 transition-colors">
                                        {item.images?.[0] ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-white/10 text-5xl">
                                                📦
                                            </div>
                                        )}

                                        {/* Price Tag Overlay */}
                                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-white/10 text-white font-mono font-bold">
                                            ${item.priceUsd.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-4 md:p-5 flex flex-col flex-grow relative">
                                        <h3 className="text-base md:text-lg font-bold text-white mb-2 leading-tight group-hover:text-[#F54029] transition-colors line-clamp-1">
                                            {item.name}
                                        </h3>

                                        <p className="text-xs md:text-sm text-gray-400 line-clamp-2 mb-4 flex-grow font-light">
                                            {item.description}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-[10px] md:text-xs text-gray-600 font-mono uppercase tracking-wider">
                                                {item.sku.substring(0, 8)}
                                            </span>

                                            <a
                                                href={`https://surge.basalthq.com/shop/utilityco?sku=${encodeURIComponent(item.sku)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 md:px-4 md:py-2 bg-white/5 hover:bg-[#F54029] hover:text-white border border-white/10 hover:border-[#F54029] text-gray-300 text-xs md:text-sm font-semibold rounded transition-all duration-300 flex items-center gap-2 group-hover:shadow-[0_0_15px_rgba(245,64,41,0.4)]"
                                            >
                                                VIEW
                                                <span className="text-[10px] group-hover:translate-x-0.5 transition-transform">→</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

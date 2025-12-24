'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useActiveAccount, ConnectButton, darkTheme } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { base } from "thirdweb/chains";
import {
    ChatBubbleLeftRightIcon,
    AcademicCapIcon,
    CurrencyDollarIcon,
    BeakerIcon,
    GlobeAltIcon,
    BookOpenIcon,
    ScaleIcon,
    LinkIcon,
    MicrophoneIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";

// Define Utility Red constant
const UTILITY_RED = '#F54029';

const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT as string,
});

interface PortalHUDProps {
    onNavigate: (view: string) => void;
    currentView: string;
}

const PortalHUD: React.FC<PortalHUDProps> = ({ onNavigate, currentView }) => {
    const account = useActiveAccount();
    const [time, setTime] = useState<string>('');
    const [medallionOpen, setMedallionOpen] = useState(false);
    const medallionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    // Close medallion menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (medallionRef.current && !medallionRef.current.contains(event.target as Node)) {
                setMedallionOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { id: 'Diamond Viewer', icon: GlobeAltIcon, label: 'NET' },
        { id: 'Chat', icon: ChatBubbleLeftRightIcon, label: 'CHAT' },
        { id: 'Directory', icon: BeakerIcon, label: 'DIR' },
        { id: 'Mythology', icon: AcademicCapIcon, label: 'LORE' },
        { id: 'Learn', icon: BookOpenIcon, label: 'LEARN' },
        { id: 'Principles', icon: ScaleIcon, label: 'CORE' },
        { id: 'Buy', icon: CurrencyDollarIcon, label: 'BUY' },
    ];

    const socialLinks = [
        { label: 'HOME', url: 'https://www.theutilitycompany.co', icon: GlobeAltIcon },
        { label: 'PHILOSOPHY', url: 'https://podcasts.apple.com/us/podcast/the-refrain/id1651052632', icon: MicrophoneIcon },
        { label: 'DATA ROOM', url: 'https://theutilitycompany.notion.site/TUC-Data-Room-633570de96654cbb92a68302ec0b7f1a?pvs=74', icon: DocumentTextIcon },
    ];

    return (
        <>
            {/* TOP STATUS BAR */}
            <div className="fixed top-0 left-0 w-full z-[2000] px-3 md:px-6 py-2 flex justify-between items-center pointer-events-none">
                {/* Left: System Status */}
                <div className="flex items-center space-x-2 md:space-x-4 pointer-events-auto">
                    <div className="flex flex-col">
                        <span className="hidden md:block text-xs font-mono text-[#F54029] tracking-widest opacity-80">SYS.ONLINE</span>
                        <span className="text-sm md:text-md font-bold text-white tracking-widest font-mono">TUC//PORTAL</span>
                    </div>
                </div>

                {/* Right: Wallet & Time */}
                <div className="flex items-center space-x-2 md:space-x-6 pointer-events-auto">
                    <div className="hidden md:block text-xs font-mono text-[#F54029] tracking-wider">
                        {time}
                    </div>
                    {/* Wrapped in a specific ID to help with potential CSS specificity if needed, but keeping it clean for now */}
                    <div id="portal-connect-wrapper">
                        <ConnectButton
                            client={client}
                            wallets={[
                                inAppWallet({
                                    auth: {
                                        options: [
                                            "google", "discord", "telegram", "farcaster", "email",
                                            "x", "passkey", "phone", "twitch", "github", "steam",
                                            "coinbase", "line", "apple", "facebook", "guest", "epic", "tiktok"
                                        ],
                                    },
                                }),
                                createWallet("io.rabby"),
                                createWallet("io.metamask"),
                                createWallet("com.coinbase.wallet"),
                                createWallet("me.rainbow"),
                                createWallet("io.zerion.wallet"),
                            ]}
                            chain={base}
                            // Add details button config to match Connect.tsx
                            detailsButton={{
                                displayBalanceToken: {
                                    [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                                },
                            }}
                            supportedTokens={{
                                [base.id]: [
                                    {
                                        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                                        name: "USD Coin",
                                        symbol: "USDC",
                                        icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
                                    },
                                ],
                            }}
                            theme={darkTheme({
                                colors: {
                                    accentText: '#F54029',
                                    accentButtonBg: '#F54029',
                                    primaryButtonBg: '#F54029',
                                    primaryButtonText: '#ffffff',
                                    secondaryButtonBg: '#050a14',
                                    secondaryButtonHoverBg: '#1a1f2e',
                                    secondaryButtonText: '#ffffff',
                                    secondaryText: '#ffccc0',
                                    modalBg: '#050a14',
                                    connectedButtonBg: '#F54029',
                                    borderColor: '#F54029',
                                    separatorLine: 'rgba(245, 64, 41, 0.2)',
                                    selectedTextBg: '#F54029',
                                    tooltipBg: '#F54029',
                                    tooltipText: '#ffffff',
                                },
                            })}
                            connectModal={{
                                size: 'wide',
                                titleIcon: 'https://storage.googleapis.com/tgl_cdn/images/Medallions/TUC.png',
                                welcomeScreen: {
                                    title: 'Mint an RWA today!',
                                    subtitle: 'Connect a wallet to build your portfolio',
                                    img: {
                                        src: 'https://storage.googleapis.com/tgl_cdn/images/Medallions/TUC.png',
                                        width: 150,
                                        height: 150,
                                    },
                                },
                                showThirdwebBranding: false,
                                privacyPolicyUrl: 'https://theutilitycompany.co/privacy',
                                termsOfServiceUrl: 'https://theutilitycompany.co/terms',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* BOTTOM DOCK */}
            <div className="fixed bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-[2000] pointer-events-auto max-w-[95vw]">
                {/* 
                     Added overflow-x-auto for horizontal scrolling on mobile. 
                     Added scrollbar-hide (assuming typical Tailwind plugin or global style).
                */}
                <div className="flex items-center space-x-1 md:space-x-2 px-3 md:px-6 py-2 md:py-3 bg-black/60 backdrop-blur-xl border border-[#F54029]/30 rounded-full shadow-[0_0_30px_rgba(245,64,41,0.2)] overflow-x-auto no-scrollbar">

                    {/* MEDALLION MENU */}
                    <div className="relative mr-1 md:mr-2 flex-shrink-0" ref={medallionRef}>
                        {medallionOpen && (
                            <div className="absolute bottom-full left-0 mb-4 w-40 bg-black/90 border border-[#F54029]/30 rounded-lg p-2 backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-200">
                                <div className="space-y-1">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.label}
                                            href={link.url}
                                            className="block px-3 py-2 text-xs font-mono text-gray-300 hover:text-white hover:bg-[#F54029]/20 rounded transition-colors flex items-center justify-between group"
                                        >
                                            {link.label}
                                            <link.icon className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                                        </a>
                                    ))}
                                </div>
                                {/* Decorative pointer */}
                                <div className="absolute -bottom-1 left-6 w-2 h-2 bg-black/90 border-r border-b border-[#F54029]/30 transform rotate-45"></div>
                            </div>
                        )}

                        <button
                            onClick={() => setMedallionOpen(!medallionOpen)}
                            className="pr-2 md:pr-4 border-r border-white/10 flex items-center transition-opacity hover:opacity-80 outline-none"
                        >
                            <img
                                src="/Medallions/TUC.png"
                                alt="TUC Medallion"
                                className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_0_8px_rgba(245,64,41,0.6)] animate-pulse-slow max-w-[40px] max-h-[40px]"
                                style={{ width: '40px', height: '40px' }}
                            />
                        </button>
                    </div>

                    {navItems.map((item) => {
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`group relative flex-shrink-0 flex flex-col items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg transition-all duration-300 ${isActive
                                    ? 'bg-[#F54029]/20 border border-[#F54029]/50 shadow-[0_0_15px_rgba(245,64,41,0.3)]'
                                    : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 md:w-5 md:h-5 mb-0.5 transition-colors ${isActive ? 'text-[#F54029]' : 'text-slate-400 group-hover:text-slate-200'}`} />
                                <span className={`text-[8px] md:text-[9px] font-mono tracking-wider ${isActive ? 'text-[#F54029]' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                    {item.label}
                                </span>

                                {/* Active Indicator */}
                                {isActive && (
                                    <div className="absolute -bottom-1 w-1/2 h-[2px] bg-[#F54029] shadow-[0_0_8px_#F54029]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* DECORATIVE HUD LINES */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-12 left-6 w-[200px] h-[1px] bg-gradient-to-r from-[#F54029]/40 to-transparent" />
                <div className="absolute top-12 right-6 w-[200px] h-[1px] bg-gradient-to-l from-[#F54029]/40 to-transparent" />
                <div className="absolute bottom-12 left-6 w-[100px] h-[1px] bg-gradient-to-r from-[#F54029]/40 to-transparent" />
                <div className="absolute bottom-12 right-6 w-[100px] h-[1px] bg-gradient-to-l from-[#F54029]/40 to-transparent" />
            </div>
        </>
    );
};

export default PortalHUD;

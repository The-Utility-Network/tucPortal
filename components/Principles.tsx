'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  getContract,
  readContract,
  prepareContractCall,
  sendAndConfirmTransaction,
  createThirdwebClient
} from 'thirdweb';
import { useActiveWallet } from 'thirdweb/react';
import { base } from 'thirdweb/chains';
import { diamondAddress } from '../primitives/Diamond';
import { FingerPrintIcon, CheckBadgeIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Initialize the client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT as string,
});

const contractAddress = diamondAddress;

// Contract ABI (Preserved)
const abi: any = [
  { "inputs": [], "name": "EnumerableSet__IndexOutOfBounds", "type": "error" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "string", "name": "name", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "PrinciplesAccepted", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "string", "name": "oldName", "type": "string" }, { "indexed": false, "internalType": "string", "name": "newName", "type": "string" }], "name": "SignerNameUpdated", "type": "event" },
  { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }], "name": "acceptPrinciples", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "getAcceptanceSignature", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "pure", "type": "function" },
  { "inputs": [], "name": "getAllPrinciples", "outputs": [{ "components": [{ "internalType": "string", "name": "japaneseName", "type": "string" }, { "internalType": "string", "name": "englishName", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }], "internalType": "struct TUCOperatingPrinciples.Principle[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getAllSigners", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getPrinciple", "outputs": [{ "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getPrincipleCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getSignerCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "signer", "type": "address" }], "name": "getSignerDetails", "outputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "hasPrinciplesAccepted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "initializePrinciples", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "isPrinciplesInitialized", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "signer", "type": "address" }, { "internalType": "string", "name": "newName", "type": "string" }], "name": "updateSignerName", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

export default function OperatingPrinciples() {
  const [principles, setPrinciples] = useState<any[]>([]);
  const [signerCount, setSignerCount] = useState<number>(0);
  const [hasAccepted, setHasAccepted] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const wallet = useActiveWallet()?.getAccount() as any;

  useEffect(() => {
    fetchPrinciples();
    fetchSignerCount();
    if (wallet) {
      checkIfUserHasAccepted();
    }
  }, [wallet]);

  const fetchPrinciples = async () => {
    try {
      const contract = getContract({ client, chain: base, address: contractAddress, abi });
      const result = await readContract({ contract, method: 'getAllPrinciples', params: [] });
      setPrinciples(result as any[]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching principles:', error);
      setLoading(false);
    }
  };

  const fetchSignerCount = async () => {
    try {
      const contract = getContract({ client, chain: base, address: contractAddress, abi });
      const count = await readContract({ contract, method: 'getSignerCount', params: [] });
      setSignerCount(Number(count));
    } catch (error) {
      console.error('Error fetching signer count:', error);
    }
  };

  const checkIfUserHasAccepted = async () => {
    try {
      const contract = getContract({ client, chain: base, address: contractAddress, abi });
      const accepted = await readContract({ contract, method: 'hasPrinciplesAccepted', params: [wallet.address] });
      setHasAccepted(accepted as boolean);
    } catch (error) {
      console.error('Error checking acceptance:', error);
    }
  };

  const handleAcceptPrinciples = async () => {
    if (!userName.trim()) {
      alert('Please enter your name before signing.');
      return;
    }
    try {
      const contract = getContract({ client, chain: base, address: contractAddress, abi });
      const transaction = prepareContractCall({
        contract,
        method: 'acceptPrinciples',
        params: [userName],
        value: BigInt(0),
      });
      await sendAndConfirmTransaction({ transaction, account: wallet! });
      setHasAccepted(true);
      fetchSignerCount();
    } catch (error) {
      console.error('Error accepting principles:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050510] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-pulse"></div>
        <div className="z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-2 border-[#F54029] border-t-transparent rounded-full animate-spin"></div>
          <div className="font-mono text-[#F54029] tracking-[0.2em] text-xs">INITIALIZING PROTOCOL...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl px-4 pb-32 pt-24 md:p-8 md:pb-36 animate-in fade-in duration-500">

      {/* Main Holographic Slate */}
      <div className="relative w-full max-w-5xl h-full bg-[#0a0a12]/90 border border-[#F54029]/30 rounded-2xl shadow-[0_0_50px_rgba(245,64,41,0.15)] overflow-hidden flex flex-col md:flex-row">

        {/* Decorative Corner Accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-[#F54029] rounded-tl-xl pointer-events-none z-20" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#F54029] rounded-br-xl pointer-events-none z-20" />
        <div className="absolute top-4 right-4 text-[10px] font-mono text-[#F54029]/50 tracking-widest pointer-events-none hidden md:block z-20">SYS.CORE.V1</div>

        {/* Left Panel: List (Bottom Nav on Mobile) */}
        <div className="w-full md:w-1/2 flex flex-col border-t md:border-t-0 md:border-r border-white/5 bg-gradient-to-b from-[#0f1016] to-[#05050a] relative order-2 md:order-1 shrink-0 z-10">

          {/* Desktop Header */}
          <div className="hidden md:block p-8 pb-4 border-b border-white/5 bg-white/[0.02]">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 font-mono">
              <span className="text-[#F54029]">TUC</span>//MANIFESTO
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                OPERATIONAL
              </span>
              <span className="text-white/20">|</span>
              <span>{signerCount} SIGNATURES VERIFIED</span>
            </div>
          </div>

          {/* List (Scrollable - Horizontal on Mobile, Vertical on Desktop) */}
          <div className="flex-1 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto p-2 md:p-4 space-x-2 md:space-x-0 md:space-y-3 custom-scrollbar flex flex-row md:flex-col items-center md:items-stretch h-24 md:h-full">
            {principles.map((principle, index) => {
              const isActive = expandedIndex === index;
              return (
                <div
                  key={index}
                  onClick={() => setExpandedIndex(isActive ? null : index)}
                  className={`group relative p-3 md:p-4 rounded-lg cursor-pointer transition-all duration-300 border flex-shrink-0 w-48 md:w-auto h-full md:h-auto flex flex-col justify-center ${isActive
                    ? 'bg-[#F54029]/10 border-[#F54029]/50 md:translate-x-1'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                      <div className={`font-mono text-xs md:text-sm opacity-50 ${isActive ? 'text-[#F54029]' : 'text-gray-500'}`}>
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="min-w-0">
                        <div className={`font-bold text-xs md:text-sm tracking-wider truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {principle.englishName.toUpperCase()}
                        </div>
                        <div className="text-[10px] md:text-xs font-mono text-gray-600 tracking-widest mt-0.5 truncate hidden md:block">
                          {principle.japaneseName}
                        </div>
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={`w-3 h-3 md:w-4 md:h-4 text-gray-500 transition-transform duration-300 hidden md:block ${isActive ? 'rotate-180 text-[#F54029]' : ''}`}
                    />
                  </div>

                  {/* Progress Line */}
                  <div
                    className={`absolute bottom-0 left-0 h-[1px] bg-[#F54029] transition-all duration-300 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Detail & Signature (Top Content on Mobile) */}
        <div className="w-full md:w-1/2 flex flex-col bg-black/40 backdrop-blur-md relative overflow-hidden order-1 md:order-2 flex-1">

          {/* Cyber Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-[length:30px_30px] pointer-events-none" />

          {/* Mobile Header (Shown inside content area on mobile) */}
          <div className="block md:hidden p-4 border-b border-white/5 bg-white/[0.02] shrink-0">
            <h1 className="text-xl font-bold text-white tracking-tight mb-1 font-mono">
              <span className="text-[#F54029]">TUC</span>//MANIFESTO
            </h1>
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
              <span>{signerCount} SIGNED</span>
              <span className="text-white/20">|</span>
              <span className="text-[#F54029]">CORE.V1</span>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-8 flex flex-col justify-center relative z-10 overflow-y-auto custom-scrollbar">
            {expandedIndex !== null ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="inline-block px-3 py-1 rounded bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] text-[10px] font-mono tracking-widest mb-4 md:mb-6">
                  PRINCIPLE_{String(expandedIndex + 1).padStart(2, '0')}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {principles[expandedIndex].englishName}
                </h2>
                <h3 className="text-lg md:text-xl font-mono text-[#F54029] mb-6 md:mb-8 opacity-80">
                  {principles[expandedIndex].japaneseName}
                </h3>

                <div className="relative p-4 md:p-6 bg-white/[0.02] border border-white/10 rounded-xl leading-relaxed text-gray-300 font-light text-base md:text-lg">
                  <div className="absolute -top-3 -left-3 text-4xl text-white/10 font-serif">"</div>
                  {principles[expandedIndex].description}
                  <div className="absolute -bottom-6 -right-3 text-4xl text-white/10 font-serif leading-none">"</div>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-30">
                <FingerPrintIcon className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 text-[#F54029] animate-pulse" />
                <div className="font-mono text-xs md:text-sm tracking-widest text-[#F54029]">SELECT A PRINCIPLE</div>
              </div>
            )}
          </div>

          {/* Signature Footer */}
          <div className="p-4 md:p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl relative z-20 shrink-0">
            {!hasAccepted ? (
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#F54029] animate-pulse" />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#F54029]">Signature Required</span>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="ENTER DESIGNATION"
                    className="w-full md:flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 font-mono text-sm focus:outline-none focus:border-[#F54029]/50 transition-colors"
                  />
                  <button
                    onClick={handleAcceptPrinciples}
                    className="w-full md:w-auto bg-[#F54029] hover:bg-[#d43520] text-white px-6 py-3 rounded-lg font-bold tracking-wider text-sm transition-all hover:shadow-[0_0_20px_rgba(245,64,41,0.4)] flex items-center justify-center gap-2"
                  >
                    SIGN <FingerPrintIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[#F54029]/10 border border-[#F54029]/30 rounded-lg p-3 md:p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#F54029]/20 p-2 rounded-full">
                    <CheckBadgeIcon className="w-5 h-5 md:w-6 md:h-6 text-[#F54029]" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-bold text-white tracking-wide">VERIFIED PERSONNEL</div>
                    <div className="text-[8px] md:text-[10px] text-[#F54029] font-mono tracking-wider">SIGNATURE RECORDED</div>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] text-gray-500 font-mono">HASH</div>
                  <div className="text-xs text-white/50 font-mono truncate w-24">0x{Math.random().toString(16).slice(2)}...</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(245,64,41,0.3); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(245,64,41,0.5); }
      `}</style>
    </div>
  );
}

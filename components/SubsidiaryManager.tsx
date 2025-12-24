'use client';

import React, { useState, useEffect } from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface Subsidiary {
  id: string;
  name: string;
  medallionUrl: string;
  link: string;
  projectStatus: 'live' | 'in progress';
  mintStatus: 'live' | 'inactive';
  description: string;
  dateEstablished: string;
  city: string;
}

const subsidiaries: Subsidiary[] = [
  {
    id: '4',
    name: 'The Graine Ledger',
    medallionUrl: '/Medallions/TGL.png',
    link: 'https://www.thegraineledger.com',
    projectStatus: 'live',
    mintStatus: 'inactive',
    description: 'Tokenized and automated brewing and distilling operations.',
    dateEstablished: 'March 2022',
    city: 'Albuquerque, NM',
  },
  {
    id: '5',
    name: 'The Loch Ness Botanical Society',
    medallionUrl: '/Medallions/TLN.png',
    link: 'https://www.thelochnessbotanicalsociety.com',
    projectStatus: 'live',
    mintStatus: 'inactive',
    description: 'Advanced industrial-scale automation and tokenization for the botanical industry.',
    dateEstablished: 'March 2022',
    city: 'Santa Fe, NM',
  },
  {
    id: '1',
    name: 'The Satellite Project Om',
    medallionUrl: '/Medallions/TSPAum1.png',
    link: 'https://omgrown.life',
    projectStatus: 'live',
    mintStatus: 'live',
    description: 'State-of-the-art tokenized and automated, vertically integrated cannabis grow operation.',
    dateEstablished: 'February 2025',
    city: 'Santa Fe, NM',
  },
  {
    id: '2',
    name: 'Vulcan Forge US',
    medallionUrl: '/Medallions/VulcanForge2.png',
    link: 'https://vulcan-forge.us',
    projectStatus: 'live',
    mintStatus: 'live',
    description: 'A network of tokenized 3D printers that can be used for onsite fabrication at your business.',
    dateEstablished: 'February 2025',
    city: 'Albuquerque, NM',
  },
  {
    id: '3',
    name: 'Requiem Electric',
    medallionUrl: '/Medallions/RE.png',
    link: 'https://www.requiem-electric.com',
    projectStatus: 'live',
    mintStatus: 'live',
    description: 'Tokenized and fractionally owned EV charging stations and renewable energy solutions.',
    dateEstablished: 'November 2022',
    city: 'Detroit, MI',
  },
  {
    id: '6',
    name: 'Arthaneeti',
    medallionUrl: '/Medallions/AR.png',
    link: 'https://www.arthaneeti.org',
    projectStatus: 'in progress',
    mintStatus: 'inactive',
    description: 'Sociopolitical media platform and political DAO development firm.',
    dateEstablished: 'August 2023',
    city: 'New Delhi, India',
  },
  {
    id: '7',
    name: 'DigiBazaar',
    medallionUrl: '/Medallions/DigiBazaarMedallion.png',
    link: 'https://digibazaar.io',
    projectStatus: 'live',
    mintStatus: 'inactive',
    description: 'Premier digital asset marketplace specializing in rare NFTs, collectibles, and blockchain-based trading systems.',
    dateEstablished: 'April 2021',
    city: 'Global',
  },
  {
    id: '8',
    name: 'Osiris Protocol',
    medallionUrl: '/Medallions/OP.png',
    link: 'https://osiris.theutilitycompany.co',
    projectStatus: 'live',
    mintStatus: 'inactive',
    description: 'The world\'s leading boutique software development firm specializing in operating at the intersection of AI, Automation, and Blockchain. Our code powers the Industrial Automation as a Service (I3AS) space.',
    dateEstablished: 'February 2024',
    city: 'Global',
  },
  {
    id: '9',
    name: 'Elysium Athletica',
    medallionUrl: '/Medallions/Elysium.png',
    link: 'https://ea.digibazaar.io',
    projectStatus: 'in progress',
    mintStatus: 'inactive',
    description: 'Tokenizing sports ecosystems and creating a new revenue stream for athletes and sports organizations.',
    dateEstablished: 'October 2023',
    city: 'Albuquerque, NM',
  },
];

export default function SubsidiaryManager() {
  const sortedSubsidiaries = [...subsidiaries].sort((a, b) => parseInt(a.id) - parseInt(b.id));
  const activeSubsidiaries = sortedSubsidiaries.filter(sub => sub.projectStatus === 'live');
  const inactiveSubsidiaries = sortedSubsidiaries.filter(sub => sub.projectStatus !== 'live');

  const handleSubsidiaryClick = (subsidiary: Subsidiary) => {
    if (subsidiary.projectStatus === 'live') {
      window.open(subsidiary.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="h-full w-full rounded-2xl shadow-2xl p-6 font-mono overflow-auto"
      style={{
        background: 'rgba(5, 10, 20, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(245, 64, 41, 0.2)',
        boxShadow: '0 0 40px rgba(245, 64, 41, 0.1)',
      }}
    >
      {/* Custom scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(245, 64, 41, 0.05);
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(245, 64, 41, 0.3);
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 64, 41, 0.5);
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold tracking-widest mb-2" style={{ color: '#F54029' }}>
          SUBSIDIARIES.NET
        </h2>
        <div className="h-px w-32 mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #F54029, transparent)' }} />
      </div>

      {/* Active Subsidiaries */}
      {activeSubsidiaries.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-[#F54029] mb-4 tracking-widest">ACTIVE.PROJECTS</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeSubsidiaries.map((subsidiary) => (
              <div
                key={subsidiary.id}
                onClick={() => handleSubsidiaryClick(subsidiary)}
                className="group p-5 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 64, 41, 0.1), rgba(200, 30, 20, 0.05))',
                  border: '1px solid rgba(245, 64, 41, 0.3)',
                  boxShadow: '0 4px 20px rgba(245, 64, 41, 0.1)',
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-4">
                    {/* Medallion */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-[#F54029]/50 overflow-hidden">
                      <img
                        src={subsidiary.medallionUrl || '/Medallions/TUC.png'}
                        alt={`${subsidiary.name} medallion`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/Medallions/TUC.png';
                        }}
                      />
                    </div>

                    {/* Company Info */}
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{subsidiary.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#F54029]/70 font-mono">
                        <span>EST. {subsidiary.dateEstablished}</span>
                        <span>•</span>
                        <span>{subsidiary.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#F54029]/60 font-mono">PROJ</span>
                      <div className={`h-2 w-2 rounded-full ${subsidiary.projectStatus === 'live' ? 'bg-green-400' : 'bg-yellow-400'
                        } shadow-lg`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#F54029]/60 font-mono">MINT</span>
                      <div className={`h-2 w-2 rounded-full ${subsidiary.mintStatus === 'live' ? 'bg-green-400' : 'bg-red-400'
                        } shadow-lg`} />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  {subsidiary.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F54029]/20">
                  <span className="text-xs text-[#F54029]/50 font-mono truncate max-w-[200px]">
                    {subsidiary.link.replace(/https?:\/\//, '').replace(/\/$/, '')}
                  </span>
                  <span className="text-xs text-[#F54029]/60 font-mono">
                    ID:{subsidiary.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Subsidiaries */}
      {inactiveSubsidiaries.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-[#F54029]/50 mb-4 tracking-widest">IN.PROGRESS</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inactiveSubsidiaries.map((subsidiary) => (
              <div
                key={subsidiary.id}
                className="p-5 rounded-xl opacity-60"
                style={{
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  filter: 'grayscale(0.7)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-gray-500/30 overflow-hidden grayscale">
                      <img
                        src={subsidiary.medallionUrl || '/Medallions/TUC.png'}
                        alt={`${subsidiary.name} medallion`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/Medallions/TUC.png';
                        }}
                      />
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-400 mb-1">{subsidiary.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                        <span>EST. {subsidiary.dateEstablished}</span>
                        <span>•</span>
                        <span>{subsidiary.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono">PROJ</span>
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono">MINT</span>
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                  {subsidiary.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-600/20">
                  <span className="text-xs text-gray-600 font-mono truncate max-w-[200px]">
                    {subsidiary.link.replace(/https?:\/\//, '').replace(/\/$/, '')}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    ID:{subsidiary.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
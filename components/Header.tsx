'use client'
import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Wallet from './Connect'
import Head from 'next/head'

const navigation = [
  { name: 'Home', href: 'https://www.theutilitycompany.co' },
  { name: 'Philosophy', href: 'https://podcasts.apple.com/us/podcast/the-refrain/id1651052632' },
  { name: 'Data Room', href: 'https://theutilitycompany.notion.site/TUC-Data-Room-633570de96654cbb92a68302ec0b7f1a?pvs=74' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tapSoundEffect, setTapSoundEffect] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/static/sounds/tap.mp3');
    setTapSoundEffect(audio);
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="theme-color" content="#F54029" />
      </Head>
      {/* <header className="bg-[rgba(255,255,255,0.1)] z-50 shadow-xl" style={{  */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel" style={{ border: 'none', borderRadius: '0 0 20px 20px' }}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex flex-1">
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-white">
                  {item.name}
                </a>
              ))}
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
                onClick={() => {
                  if (tapSoundEffect) {
                    tapSoundEffect.play();
                  }
                  setMobileMenuOpen(true);
                }}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Requiem Electric LLC</span>
            <img className="h-16 w-auto" src="/Medallions/TUC.png" alt="" />
          </a>
          <div className="hidden lg:flex flex-1 justify-end">
            <div
              className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                if (tapSoundEffect) {
                  tapSoundEffect.play();
                }
              }}
            >
              <Wallet /> <span aria-hidden="true"></span>
            </div>
          </div>
        </nav>
        <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto px-6 py-6 glass-panel">
            <div className="flex items-center justify-between">
              <div className="flex flex-1">
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-white"
                  onClick={() => {
                    tapSoundEffect?.play();
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Requiem Electric LLC</span>
                <img
                  className="h-16 w-auto"
                  src="/Medallions/RE.png"
                  alt=""
                />
              </a>
            </div>
            <div className="mt-6 space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-50"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="mt-6 flex flex-1 justify-center">
              <div
                className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (tapSoundEffect) {
                    tapSoundEffect.play();
                  }
                }}
              >
                <Wallet /> <span aria-hidden="true"></span>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </>
  )
}
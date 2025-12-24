'use client';

import {
  ConnectButton,
  darkTheme,
} from 'thirdweb/react';
import { inAppWallet, createWallet } from 'thirdweb/wallets';
import { base } from 'thirdweb/chains';
import { createThirdwebClient } from 'thirdweb';

// Create client once
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT as string,
});

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
        "twitch",
        "github",
        "steam",
        "coinbase",
        "line",
        "apple",
        "facebook",
        "guest",
      ],
    },
  }),
  createWallet("io.rabby"),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.zerion.wallet"),
];

export default function Wallet() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      chain={base}
      detailsButton={{
        displayBalanceToken: {
          [base.id]: "0x389dfbCB6Ee872efa97bb5713d76DdA8419Af8CC", // token address to display balance for
        },
      }}
      supportedTokens={{
        [base.id]: [
          {
            address: "0x389dfbCB6Ee872efa97bb5713d76DdA8419Af8CC",
            name: "Machiavelli",
            symbol: "MKVLI",
            icon: "https://storage.googleapis.com/tgl_cdn/images/Medallions/MKVLI.png",
          },
        ],
      }}
      accountAbstraction={{
        chain: base,
        sponsorGas: true,
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
        titleIcon:
          'https://storage.googleapis.com/tgl_cdn/images/Medallions/TUC.png',
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
  );
}

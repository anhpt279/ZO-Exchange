"use client";

import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  coin98Wallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { arbitrumSepolia, bsc, bscTestnet } from "wagmi/chains";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, walletConnectWallet, coinbaseWallet],
    },
    {
      groupName: "Other",
      wallets: [trustWallet, coin98Wallet, ledgerWallet],
    },
  ],
  {
    appName: "ZOFI",
    projectId: "476b3651d1cb07885f9bf178058f5a36",
  }
);

type Props = {
  children: React.ReactNode;
};

const config = createConfig({
  connectors,
  chains: [bsc, bscTestnet, arbitrumSepolia],
  ssr: true,
  transports: {
    [bsc.id]: http("https://bsc-dataseed.binance.org/"),
    [bscTestnet.id]: http("https://data-seed-prebsc-1-s3.binance.org:8545/"),
    [arbitrumSepolia.id]: http("https://sepolia-rollup.arbitrum.io/rpc"),
  },
});

const queryClient = new QueryClient();

const Blockchain = ({ children }: Props) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          coolMode={true}
          modalSize="compact"
          theme={{
            lightMode: lightTheme({
              accentColor: "#9DB9E7",
              accentColorForeground: "#000000",
            }),
            darkMode: darkTheme(),
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Blockchain;

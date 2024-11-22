import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  darkTheme,
  RainbowKitAuthenticationProvider,
  createAuthenticationAdapter,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { createSiweMessage } from 'viem/siwe';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import config from '@/providers/wagmiConfig';
import type { AppProps } from 'next/app';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const queryClient = new QueryClient();

export type VerifyArgs = {
  message: string;
  signature: string;
};

const ConnectWalletProvider = ({
  children,
  pageProps,
}: {
  children: React.ReactNode;
  pageProps: AppProps['pageProps'];
}) => {
  const { authStatus, isAuthenticated, getNonce, fetchAuthStatus, verifyWallet, logOut } = useAuth();

  useEffect(() => {
    fetchAuthStatus();

    // window.addEventListener('focus', fetchAuthStatus);
    // return () => window.removeEventListener('focus', fetchAuthStatus);
  }, []);

  const authAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getMessageBody<Message>(args: { message: Message }): string {
        return args.message as string;
      },
      getNonce: async () => await getNonce(),

      createMessage: ({ nonce, address, chainId }) => {
        return createSiweMessage({
          domain: window.location.host,
          // @ts-ignore
          address: address,
          statement: 'Sign in to DegenPigeon App',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        });
      },

      verify: async ({ message, signature }: VerifyArgs) => verifyWallet({ message, signature }),

      signOut: async () => {
        if (isAuthenticated) {
          logOut();
        }
      },
    });
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider adapter={authAdapter} status={authStatus}>
          <RainbowKitProvider theme={darkTheme()} modalSize='compact'>
            {children}
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default ConnectWalletProvider;

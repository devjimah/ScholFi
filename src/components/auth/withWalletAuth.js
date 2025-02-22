'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';

export default function withWalletAuth(WrappedComponent) {
  return function ProtectedRoute(props) {
    const { isConnected } = useWallet();
    const router = useRouter();

    useEffect(() => {
      if (!isConnected) {
        router.push('/');
      }
    }, [isConnected, router]);

    // Show nothing while checking authentication
    if (!isConnected) {
      return null;
    }

    // If authenticated, render component
    return <WrappedComponent {...props} />;
  };
}

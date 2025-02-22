'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useTransactionConfirm() {
  const router = useRouter();
  const [isTransactionComplete, setIsTransactionComplete] = useState(false);

  useEffect(() => {
    if (isTransactionComplete) {
      const timer = setTimeout(() => {
        router.refresh();
        setIsTransactionComplete(false);
      }, 2000); // Wait 2 seconds before refreshing
      return () => clearTimeout(timer);
    }
  }, [isTransactionComplete, router]);

  const confirmTransaction = () => {
    setIsTransactionComplete(true);
  };

  return { confirmTransaction };
}

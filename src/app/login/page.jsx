'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/app/components/auth/LoginForm';
import { Icons } from '@/components/icons';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're not loading and user exists
    if (!loading && user) {
      router.replace('/bets');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Only show form if not loading and no user
  if (!loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoginForm />
      </div>
    );
  }

  // Return empty div while redirecting
  return <div />;
}

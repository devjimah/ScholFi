'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { ethers } from 'ethers';

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    walletAddress: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.walletAddress) {
      newErrors.walletAddress = 'Wallet address is required';
    } else if (!ethers.isAddress(formData.walletAddress)) {
      newErrors.walletAddress = 'Invalid wallet address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await signup(formData.email, formData.password, formData.walletAddress);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your email and password below to create your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="walletAddress">Wallet Address</Label>
              <Input
                id="walletAddress"
                name="walletAddress"
                placeholder="0x..."
                type="text"
                value={formData.walletAddress}
                onChange={handleChange}
              />
              {errors.walletAddress && <span className="text-sm text-red-500">{errors.walletAddress}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="text-sm text-red-500">{errors.confirmPassword}</span>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

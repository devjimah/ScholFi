'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Coins, 
  Vote, 
  Ticket, 
  Shield, 
  Zap, 
  Users,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isConnected) {
      router.push('/bets');
    }
  }, [isConnected, router]);

  if (!mounted) return null;

  const features = [
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Decentralized Betting",
      description: "Create and participate in peer-to-peer bets with transparent outcomes"
    },
    {
      icon: <Vote className="w-6 h-6" />,
      title: "Community Polls",
      description: "Create polls and vote on community decisions with blockchain security"
    },
    {
      icon: <Ticket className="w-6 h-6" />,
      title: "Fair Raffles",
      description: "Join exciting raffles with verifiable random outcomes"
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Transparent",
      description: "All transactions and outcomes are recorded on the blockchain"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast & Efficient",
      description: "Quick settlements and automated payouts"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Participate in a growing ecosystem of users"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/90 to-background/80">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
                ScholFi
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl">
              The Next Generation Decentralized Betting Platform
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <ConnectButton />
            <p className="text-sm text-muted-foreground">
              Connect your wallet to start betting
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-8"
          >
            <Card className="bg-background/50 backdrop-blur-sm border-muted">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex flex-col items-center text-center space-y-3 p-4"
                    >
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Why Choose ScholFi?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of decentralized betting with our secure and transparent platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <Card className="h-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5">
                  <CardContent className="p-6 space-y-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary w-fit">
                      {benefit.icon}
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <Button
              size="lg"
              className="group"
              onClick={() => window.open('https://docs.scholfi.org', '_blank')}
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p> 2025 ScholFi. All rights reserved.</p>
      </footer>
    </main>
  );
}

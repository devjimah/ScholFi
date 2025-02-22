'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Coins, Users, Trophy, Loader2, Sparkles, School, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccount } from 'wagmi';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const features = [
  {
    title: "Competitive Gaming",
    description: "Engage in thrilling competitions and tournaments with students from other schools.",
    icon: Gamepad2,
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    title: "Smart Rewards",
    description: "Earn tokens and rewards for your academic and gaming achievements.",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "School Spirit",
    description: "Represent your school and compete for glory in the digital arena.",
    icon: School,
    gradient: "from-amber-500 to-orange-500"
  }
];

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Show homepage if not connected or not authenticated
  if (!isConnected || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-4 opacity-20">
          {[...Array(64)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="min-h-screen flex flex-col justify-center items-center px-4 py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 relative"
            >
              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
              />
              <motion.div
                className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: 2
                }}
              />

              <h1 className="text-7xl font-bold mb-8 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  SchoolFi
                </span>
                <motion.div
                  className="absolute -top-4 -right-4 text-yellow-500"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity
                  }}
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
              </h1>
              
              <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Where Academic Excellence Meets Gaming Innovation
              </p>

              <motion.div 
                className="flex flex-wrap gap-4 justify-center"
                variants={staggerContainer}
              >
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-6"
                    >
                      Start Your Journey
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    <motion.div 
                      className="mb-6 p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 w-fit"
                      variants={floatingAnimation}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // If connected and authenticated, return null (middleware will handle redirect)
  return null;
}
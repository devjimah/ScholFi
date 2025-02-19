'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Crypto Enthusiast",
    avatar: "/avatars/alex.jpg",
    text: "ScholFi has revolutionized the way I engage with betting platforms. The transparency and security are unmatched!"
  },
  {
    name: "Sarah Chen",
    role: "DeFi Researcher",
    avatar: "/avatars/sarah.jpg",
    text: "The community aspect of ScholFi sets it apart. I've met brilliant minds and made profitable decisions."
  },
  {
    name: "Michael Rodriguez",
    role: "Blockchain Developer",
    avatar: "/avatars/michael.jpg",
    text: "As a developer, I appreciate the technical excellence of ScholFi. The smart contracts are well-designed and secure."
  }
]

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-secondary/30 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={testimonials[currentIndex].avatar} />
                  <AvatarFallback>{testimonials[currentIndex].name[0]}</AvatarFallback>
                </Avatar>
                <blockquote className="text-xl italic text-muted-foreground">
                  "{testimonials[currentIndex].text}"
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonials[currentIndex].name}</div>
                  <div className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      
      <div className="flex justify-center mt-4 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-primary w-4' : 'bg-primary/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

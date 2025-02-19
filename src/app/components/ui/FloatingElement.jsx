'use client'

import { motion } from 'framer-motion'

export default function FloatingElement({ children, delay = 0, duration = 4, className = '' }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  )
}

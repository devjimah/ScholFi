'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const NOTIFICATION_TTL = 5000 // Time to live in milliseconds

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([])

  // Custom event listener for adding notifications
  useEffect(() => {
    const handleNewNotification = (event) => {
      const { type, message, ttl = NOTIFICATION_TTL } = event.detail
      const id = Date.now()
      
      setNotifications(prev => [...prev, { id, type, message }])
      
      // Auto remove after TTL
      setTimeout(() => {
        removeNotification(id)
      }, ttl)
    }

    window.addEventListener('scholfi:notification', handleNewNotification)
    return () => window.removeEventListener('scholfi:notification', handleNewNotification)
  }, [])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Helper function to emit notifications
  const notify = (type, message, ttl = NOTIFICATION_TTL) => {
    window.dispatchEvent(
      new CustomEvent('scholfi:notification', {
        detail: { type, message, ttl }
      })
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {notifications.map(({ id, type, message }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              relative p-4 rounded-lg shadow-lg backdrop-blur-sm
              ${type === 'success' && 'bg-green-500/80 text-white'}
              ${type === 'error' && 'bg-red-500/80 text-white'}
              ${type === 'info' && 'bg-blue-500/80 text-white'}
              ${type === 'warning' && 'bg-yellow-500/80 text-white'}
            `}
          >
            <button
              onClick={() => removeNotification(id)}
              className="absolute top-1 right-1 p-1 rounded-full hover:bg-black/10"
            >
              <X size={14} />
            </button>
            <p className="pr-4">{message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Export helper function
export const notify = (type, message, ttl = NOTIFICATION_TTL) => {
  window.dispatchEvent(
    new CustomEvent('scholfi:notification', {
      detail: { type, message, ttl }
    })
  )
}

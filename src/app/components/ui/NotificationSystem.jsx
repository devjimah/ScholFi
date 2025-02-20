'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const NOTIFICATION_TTL = 5000 // Time to live in milliseconds

// Define notify function at the top level
export const notify = (type, message, ttl = NOTIFICATION_TTL) => {
  window.dispatchEvent(
    new CustomEvent('scholfi:notification', {
      detail: { type, message, ttl }
    })
  )
}

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
              min-w-[300px] p-4 rounded-lg shadow-lg
              ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}
              text-white
            `}
          >
            <div className="flex items-center justify-between">
              <p>{message}</p>
              <button
                onClick={() => removeNotification(id)}
                className="ml-4 hover:opacity-75"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

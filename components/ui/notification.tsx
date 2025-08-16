"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { Button } from "./button"

interface NotificationProps {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  notifications: NotificationProps[]
  addNotification: (notification: Omit<NotificationProps, "id" | "onClose">) => void
  removeNotification: (id: string) => void
}

const notificationTypes = {
  success: {
    icon: CheckCircle,
    className: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
    iconClassName: "text-green-600"
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
    iconClassName: "text-red-600"
  },
  warning: {
    icon: AlertTriangle,
    className: "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    iconClassName: "text-yellow-600"
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    iconClassName: "text-blue-600"
  }
}

export function Notification({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  action 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  
  const notificationType = notificationTypes[type]
  const Icon = notificationType.icon

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    
    // Auto dismiss
    if (duration > 0) {
      const dismissTimer = setTimeout(() => {
        handleClose()
      }, duration)
      
      return () => {
        clearTimeout(timer)
        clearTimeout(dismissTimer)
      }
    }
    
    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  return (
    <div
      className={cn(
        "notification",
        isVisible && "notification-enter-active",
        isExiting && "notification-exit-active",
        notificationType.className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", notificationType.iconClassName)} />
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium">{title}</h4>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
          {action && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  action.onClick()
                  handleClose()
                }}
                className="text-xs"
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="flex-shrink-0 h-6 w-6 p-0 opacity-70 hover:opacity-100"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export function NotificationContainer() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  const addNotification = (notification: Omit<NotificationProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: NotificationProps = {
      ...notification,
      id,
      onClose: removeNotification
    }
    
    setNotifications(prev => [...prev, newNotification])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  // Expose addNotification globally for easy access
  useEffect(() => {
    ;(window as any).showNotification = addNotification
    return () => {
      delete (window as any).showNotification
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>
  )
}

// Utility functions for easy notification creation
export const showNotification = {
  success: (title: string, message?: string, action?: { label: string; onClick: () => void }) => {
    if (typeof window !== "undefined" && (window as any).showNotification) {
      ;(window as any).showNotification({
        type: "success",
        title,
        message,
        action
      })
    }
  },
  
  error: (title: string, message?: string, action?: { label: string; onClick: () => void }) => {
    if (typeof window !== "undefined" && (window as any).showNotification) {
      ;(window as any).showNotification({
        type: "error",
        title,
        message,
        action
      })
    }
  },
  
  warning: (title: string, message?: string, action?: { label: string; onClick: () => void }) => {
    if (typeof window !== "undefined" && (window as any).showNotification) {
      ;(window as any).showNotification({
        type: "warning",
        title,
        message,
        action
      })
    }
  },
  
  info: (title: string, message?: string, action?: { label: string; onClick: () => void }) => {
    if (typeof window !== "undefined" && (window as any).showNotification) {
      ;(window as any).showNotification({
        type: "info",
        title,
        message,
        action
      })
    }
  }
}

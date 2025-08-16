"use client"

import { cn } from "@/lib/utils"
import { Loader2, FileText, Brain, CheckCircle, AlertCircle } from "lucide-react"

interface LoadingProps {
  type?: "spinner" | "dots" | "skeleton" | "progress" | "pulse"
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

interface LoadingOverlayProps {
  isVisible: boolean
  text?: string
  type?: "full" | "card"
}

interface LoadingStateProps {
  state: "idle" | "loading" | "success" | "error"
  text?: string
  className?: string
}

export function Loading({ type = "spinner", size = "md", text, className }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }

  const renderLoader = () => {
    switch (type) {
      case "spinner":
        return (
          <div className={cn("loading-spinner", sizeClasses[size], className)} />
        )
      case "dots":
        return (
          <div className="loading-dots">
            <div className={sizeClasses[size]}></div>
            <div className={sizeClasses[size]}></div>
            <div className={sizeClasses[size]}></div>
          </div>
        )
      case "skeleton":
        return (
          <div className={cn("loading-skeleton", sizeClasses[size], className)} />
        )
      case "progress":
        return (
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        )
      case "pulse":
        return (
          <div className={cn("animate-pulse bg-muted rounded-full", sizeClasses[size], className)} />
        )
      default:
        return <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoader()}
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  )
}

export function LoadingOverlay({ isVisible, text = "Loading...", type = "full" }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="loading-overlay">
      {type === "card" ? (
        <div className="loading-card">
          <Loading type="dots" size="lg" text={text} />
        </div>
      ) : (
        <Loading type="spinner" size="lg" text={text} />
      )}
    </div>
  )
}

export function LoadingState({ state, text, className }: LoadingStateProps) {
  const states = {
    idle: {
      icon: FileText,
      text: text || "Ready to start",
      className: "text-muted-foreground"
    },
    loading: {
      icon: Brain,
      text: text || "Processing...",
      className: "text-primary"
    },
    success: {
      icon: CheckCircle,
      text: text || "Completed successfully",
      className: "text-green-600"
    },
    error: {
      icon: AlertCircle,
      text: text || "An error occurred",
      className: "text-red-600"
    }
  }

  const currentState = states[state]
  const Icon = currentState.icon

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {state === "loading" ? (
        <Loading type="spinner" size="sm" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
      <span className={cn("text-sm", currentState.className)}>
        {currentState.text}
      </span>
    </div>
  )
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="h-4 bg-muted rounded w-4/6"></div>
      </div>
      <div className="flex space-x-2">
        <div className="h-6 bg-muted rounded w-16"></div>
        <div className="h-6 bg-muted rounded w-20"></div>
        <div className="h-6 bg-muted rounded w-14"></div>
      </div>
    </div>
  )
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
              </td>
              <td>
                <div className="h-4 bg-muted rounded w-16"></div>
              </td>
              <td>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: `${Math.random() * 100}%` }}></div>
                </div>
              </td>
              <td>
                <div className="flex space-x-1">
                  <div className="h-6 bg-muted rounded w-12"></div>
                  <div className="h-6 bg-muted rounded w-12"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

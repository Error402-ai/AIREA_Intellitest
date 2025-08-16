import { getDatabaseService } from "./database"

export interface User {
  id: string
  email: string
  name: string
  role: "student" | "teacher" | "admin"
  avatar?: string
  preferences?: UserPreferences
  createdAt: string
  lastLogin: string
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  notifications: boolean
  language: string
  timezone: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: number
}

export class AuthService {
  private db = getDatabaseService()
  private readonly SESSION_KEY = "intellitest_session"
  private readonly TOKEN_EXPIRY_HOURS = 24

  // Mock user database - in real app, this would be in a proper database
  private users: User[] = [
    {
      id: "1",
      email: "teacher@example.com",
      name: "Dr. Sarah Johnson",
      role: "teacher",
      avatar: "/placeholder-user.jpg",
      preferences: {
        theme: "system",
        notifications: true,
        language: "en",
        timezone: "UTC",
      },
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: new Date().toISOString(),
    },
    {
      id: "2",
      email: "student@example.com",
      name: "Alex Chen",
      role: "student",
      avatar: "/placeholder-user.jpg",
      preferences: {
        theme: "dark",
        notifications: true,
        language: "en",
        timezone: "UTC",
      },
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: new Date().toISOString(),
    },
    {
      id: "3",
      email: "john.teacher@university.edu",
      name: "Prof. John Smith",
      role: "teacher",
      avatar: "/placeholder-user.jpg",
      preferences: {
        theme: "light",
        notifications: false,
        language: "en",
        timezone: "UTC",
      },
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: new Date().toISOString(),
    },
    {
      id: "4",
      email: "mary.student@university.edu",
      name: "Mary Williams",
      role: "student",
      avatar: "/placeholder-user.jpg",
      preferences: {
        theme: "system",
        notifications: true,
        language: "en",
        timezone: "UTC",
      },
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: new Date().toISOString(),
    },
  ]

  async login(email: string, password: string): Promise<AuthSession | null> {
    try {
      // In a real app, you'd hash the password and check against database
      const user = this.users.find(u => u.email === email && password === "password")
      
      if (!user) {
        return null
      }

      // Update last login
      user.lastLogin = new Date().toISOString()
      
      // Generate session token
      const token = this.generateToken(user)
      const expiresAt = Date.now() + (this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)
      
      const session: AuthSession = {
        user,
        token,
        expiresAt,
      }

      // Store session
      this.storeSession(session)
      
      return session
    } catch (error) {
      console.error("Login error:", error)
      return null
    }
  }

  async logout(): Promise<void> {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(this.SESSION_KEY)
        sessionStorage.removeItem(this.SESSION_KEY)
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const session = this.getStoredSession()
      if (!session || this.isSessionExpired(session)) {
        return null
      }
      return session.user
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null
  }

  async hasRole(role: User["role"]): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user?.role === role
  }

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error("User not authenticated")

      // Update user preferences
      const updatedUser: User = {
        ...user,
        preferences: {
          theme: preferences.theme || user.preferences?.theme || "system",
          notifications: preferences.notifications ?? user.preferences?.notifications ?? true,
          language: preferences.language || user.preferences?.language || "en",
          timezone: preferences.timezone || user.preferences?.timezone || "UTC",
        },
      }

      // Update in users array
      const userIndex = this.users.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        this.users[userIndex] = updatedUser
      }

      // Update session
      const session = this.getStoredSession()
      if (session) {
        session.user = updatedUser
        this.storeSession(session)
      }
    } catch (error) {
      console.error("Update preferences error:", error)
      throw error
    }
  }

  async register(email: string, name: string, role: User["role"]): Promise<User | null> {
    try {
      // Check if user already exists
      if (this.users.find(u => u.email === email)) {
        throw new Error("User already exists")
      }

      const newUser: User = {
        id: (this.users.length + 1).toString(),
        email,
        name,
        role,
        avatar: "/placeholder-user.jpg",
        preferences: {
          theme: "system",
          notifications: true,
          language: "en",
          timezone: "UTC",
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      this.users.push(newUser)
      return newUser
    } catch (error) {
      console.error("Registration error:", error)
      return null
    }
  }

  async changePassword(email: string, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      // In a real app, you'd hash passwords and update in database
      const user = this.users.find(u => u.email === email && oldPassword === "password")
      if (!user) return false

      // Update password (in real app, hash the new password)
      console.log(`Password changed for user ${email}`)
      return true
    } catch (error) {
      console.error("Change password error:", error)
      return false
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      const user = this.users.find(u => u.email === email)
      if (!user) return false

      // In a real app, you'd send a reset email
      console.log(`Password reset email sent to ${email}`)
      return true
    } catch (error) {
      console.error("Reset password error:", error)
      return false
    }
  }

  private generateToken(user: User): string {
    // In a real app, use JWT or similar
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now(),
    }
    return btoa(JSON.stringify(payload))
  }

  private storeSession(session: AuthSession): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
      } catch (error) {
        // Fallback to sessionStorage if localStorage fails
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
      }
    }
  }

  private getStoredSession(): AuthSession | null {
    if (typeof window === "undefined") return null

    try {
      const data = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Get stored session error:", error)
      return null
    }
  }

  private isSessionExpired(session: AuthSession): boolean {
    return Date.now() > session.expiresAt
  }

  // Utility methods for development
  getMockUsers(): User[] {
    return this.users
  }

  addMockUser(user: User): void {
    this.users.push(user)
  }
}

// Export singleton instance
export const authService = new AuthService()

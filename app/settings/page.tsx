"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Globe, 
  Download, 
  Trash2,
  Save,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Laptop,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  Languages,
  Accessibility,
  Zap,
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react"
import { useTheme } from "next-themes"

interface UserSettings {
  profile: {
    name: string
    email: string
    avatar: string
    bio: string
    timezone: string
    language: string
  }
  appearance: {
    theme: "light" | "dark" | "system"
    fontSize: "small" | "medium" | "large"
    colorScheme: "blue" | "green" | "purple" | "orange" | "red"
    animations: boolean
    reducedMotion: boolean
  }
  notifications: {
    email: boolean
    push: boolean
    assessmentReminders: boolean
    studyReminders: boolean
    progressUpdates: boolean
    feedbackAlerts: boolean
    soundEnabled: boolean
    quietHours: {
      enabled: boolean
      start: string
      end: string
    }
  }
  privacy: {
    profileVisibility: "public" | "private" | "friends"
    dataSharing: boolean
    analytics: boolean
    locationSharing: boolean
  }
  accessibility: {
    highContrast: boolean
    screenReader: boolean
    keyboardNavigation: boolean
    focusIndicators: boolean
  }
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder-user.jpg",
      bio: "Passionate learner focused on AI and machine learning",
      timezone: "UTC-5",
      language: "en"
    },
    appearance: {
      theme: "system",
      fontSize: "medium",
      colorScheme: "blue",
      animations: true,
      reducedMotion: false
    },
    notifications: {
      email: true,
      push: true,
      assessmentReminders: true,
      studyReminders: true,
      progressUpdates: true,
      feedbackAlerts: true,
      soundEnabled: true,
      quietHours: {
        enabled: false,
        start: "22:00",
        end: "08:00"
      }
    },
    privacy: {
      profileVisibility: "private",
      dataSharing: false,
      analytics: true,
      locationSharing: false
    },
    accessibility: {
      highContrast: false,
      screenReader: false,
      keyboardNavigation: true,
      focusIndicators: true
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setSettings(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              name: data.user.name || prev.profile.name,
              email: data.user.email || prev.profile.email,
              avatar: data.user.avatar || prev.profile.avatar
            }
          }))
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update theme if changed
      if (settings.appearance.theme !== theme) {
        setTheme(settings.appearance.theme)
      }
      
      console.log("Settings saved:", settings)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      const data = {
        profile: settings.profile,
        preferences: {
          appearance: settings.appearance,
          notifications: settings.notifications,
          privacy: settings.privacy,
          accessibility: settings.accessibility
        },
        exportDate: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "intellitest-settings.json"
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // Simulate account deletion
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log("Account deleted")
      } catch (error) {
        console.error("Error deleting account:", error)
      }
    }
  }

  const updateSetting = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const updateNestedSetting = (category: keyof UserSettings, parentKey: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [parentKey]: {
          ...(prev[category] as any)[parentKey],
          [key]: value
        }
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <main className="lg:ml-64 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground text-lg">
              Customize your IntelliTest experience
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center space-x-2">
                <Accessibility className="h-4 w-4" />
                <span className="hidden sm:inline">Accessibility</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Advanced</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Profile Information</span>
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={settings.profile.name}
                        onChange={(e) => updateSetting("profile", "name", e.target.value)}
                        className="bg-white/50 dark:bg-gray-700/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSetting("profile", "email", e.target.value)}
                        className="bg-white/50 dark:bg-gray-700/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={settings.profile.bio}
                      onChange={(e) => updateSetting("profile", "bio", e.target.value)}
                      rows={3}
                      className="bg-white/50 dark:bg-gray-700/50"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        value={settings.profile.timezone} 
                        onValueChange={(value) => updateSetting("profile", "timezone", value)}
                      >
                        <SelectTrigger className="bg-white/50 dark:bg-gray-700/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="UTC+0">UTC</SelectItem>
                          <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                          <SelectItem value="UTC+5:30">India Standard Time (UTC+5:30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={settings.profile.language} 
                        onValueChange={(value) => updateSetting("profile", "language", value)}
                      >
                        <SelectTrigger className="bg-white/50 dark:bg-gray-700/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Password Change */}
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-5 w-5 text-green-600" />
                    <span>Change Password</span>
                  </CardTitle>
                  <CardDescription>
                    Update your account password for enhanced security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-white/50 dark:bg-gray-700/50 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-white/50 dark:bg-gray-700/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white/50 dark:bg-gray-700/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5 text-purple-600" />
                    <span>Appearance & Theme</span>
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of IntelliTest
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <div className="grid grid-cols-3 gap-3">
                        <Button
                          variant={settings.appearance.theme === "light" ? "default" : "outline"}
                          onClick={() => updateSetting("appearance", "theme", "light")}
                          className="flex flex-col items-center space-y-2 h-auto p-4"
                        >
                          <Sun className="h-5 w-5" />
                          <span className="text-xs">Light</span>
                        </Button>
                        <Button
                          variant={settings.appearance.theme === "dark" ? "default" : "outline"}
                          onClick={() => updateSetting("appearance", "theme", "dark")}
                          className="flex flex-col items-center space-y-2 h-auto p-4"
                        >
                          <Moon className="h-5 w-5" />
                          <span className="text-xs">Dark</span>
                        </Button>
                        <Button
                          variant={settings.appearance.theme === "system" ? "default" : "outline"}
                          onClick={() => updateSetting("appearance", "theme", "system")}
                          className="flex flex-col items-center space-y-2 h-auto p-4"
                        >
                          <Monitor className="h-5 w-5" />
                          <span className="text-xs">System</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Color Scheme</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {["blue", "green", "purple", "orange", "red"].map((color) => (
                          <Button
                            key={color}
                            variant={settings.appearance.colorScheme === color ? "default" : "outline"}
                            onClick={() => updateSetting("appearance", "colorScheme", color)}
                            className={`h-12 w-12 p-0 rounded-full ${
                              color === "blue" ? "bg-blue-500" :
                              color === "green" ? "bg-green-500" :
                              color === "purple" ? "bg-purple-500" :
                              color === "orange" ? "bg-orange-500" :
                              "bg-red-500"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Select 
                        value={settings.appearance.fontSize} 
                        onValueChange={(value) => updateSetting("appearance", "fontSize", value)}
                      >
                        <SelectTrigger className="bg-white/50 dark:bg-gray-700/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Animations</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable smooth animations and transitions
                        </p>
                      </div>
                      <Switch
                        checked={settings.appearance.animations}
                        onCheckedChange={(checked) => updateSetting("appearance", "animations", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Reduced Motion</Label>
                        <p className="text-sm text-muted-foreground">
                          Reduce motion for accessibility
                        </p>
                      </div>
                      <Switch
                        checked={settings.appearance.reducedMotion}
                        onCheckedChange={(checked) => updateSetting("appearance", "reducedMotion", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Control how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => updateSetting("notifications", "email", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive browser push notifications
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => updateSetting("notifications", "push", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sound Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Play sounds for notifications
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.soundEnabled}
                        onCheckedChange={(checked) => updateSetting("notifications", "soundEnabled", checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Assessment Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Remind me about upcoming assessments
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.assessmentReminders}
                          onCheckedChange={(checked) => updateSetting("notifications", "assessmentReminders", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Study Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Daily study session reminders
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.studyReminders}
                          onCheckedChange={(checked) => updateSetting("notifications", "studyReminders", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Progress Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Weekly progress summaries
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.progressUpdates}
                          onCheckedChange={(checked) => updateSetting("notifications", "progressUpdates", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Feedback Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            When teachers provide feedback
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.feedbackAlerts}
                          onCheckedChange={(checked) => updateSetting("notifications", "feedbackAlerts", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Quiet Hours</Label>
                        <p className="text-sm text-muted-foreground">
                          Pause notifications during specific hours
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.quietHours.enabled}
                        onCheckedChange={(checked) => updateNestedSetting("notifications", "quietHours", "enabled", checked)}
                      />
                    </div>
                    
                    {settings.notifications.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={settings.notifications.quietHours.start}
                            onChange={(e) => updateNestedSetting("notifications", "quietHours", "start", e.target.value)}
                            className="bg-white/50 dark:bg-gray-700/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={settings.notifications.quietHours.end}
                            onChange={(e) => updateNestedSetting("notifications", "quietHours", "end", e.target.value)}
                            className="bg-white/50 dark:bg-gray-700/50"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span>Privacy & Security</span>
                  </CardTitle>
                  <CardDescription>
                    Control your privacy settings and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <Select 
                      value={settings.privacy.profileVisibility} 
                      onValueChange={(value) => updateSetting("privacy", "profileVisibility", value)}
                    >
                      <SelectTrigger className="bg-white/50 dark:bg-gray-700/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can see my profile</SelectItem>
                        <SelectItem value="friends">Friends - Only friends can see my profile</SelectItem>
                        <SelectItem value="private">Private - Only I can see my profile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Sharing</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow sharing of anonymized data for research
                        </p>
                      </div>
                      <Switch
                        checked={settings.privacy.dataSharing}
                        onCheckedChange={(checked) => updateSetting("privacy", "dataSharing", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Analytics</Label>
                        <p className="text-sm text-muted-foreground">
                          Help improve IntelliTest with usage analytics
                        </p>
                      </div>
                      <Switch
                        checked={settings.privacy.analytics}
                        onCheckedChange={(checked) => updateSetting("privacy", "analytics", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Location Sharing</Label>
                        <p className="text-sm text-muted-foreground">
                          Share location for personalized content
                        </p>
                      </div>
                      <Switch
                        checked={settings.privacy.locationSharing}
                        onCheckedChange={(checked) => updateSetting("privacy", "locationSharing", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accessibility Settings */}
            <TabsContent value="accessibility" className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Accessibility className="h-5 w-5 text-indigo-600" />
                    <span>Accessibility</span>
                  </CardTitle>
                  <CardDescription>
                    Customize the interface for better accessibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>High Contrast</Label>
                        <p className="text-sm text-muted-foreground">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <Switch
                        checked={settings.accessibility.highContrast}
                        onCheckedChange={(checked) => updateSetting("accessibility", "highContrast", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Screen Reader Support</Label>
                        <p className="text-sm text-muted-foreground">
                          Optimize for screen readers
                        </p>
                      </div>
                      <Switch
                        checked={settings.accessibility.screenReader}
                        onCheckedChange={(checked) => updateSetting("accessibility", "screenReader", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Keyboard Navigation</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable full keyboard navigation
                        </p>
                      </div>
                      <Switch
                        checked={settings.accessibility.keyboardNavigation}
                        onCheckedChange={(checked) => updateSetting("accessibility", "keyboardNavigation", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Focus Indicators</Label>
                        <p className="text-sm text-muted-foreground">
                          Show clear focus indicators
                        </p>
                      </div>
                      <Switch
                        checked={settings.accessibility.focusIndicators}
                        onCheckedChange={(checked) => updateSetting("accessibility", "focusIndicators", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced" className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span>Advanced Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Advanced options and data management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Export Data</Label>
                        <p className="text-sm text-muted-foreground">
                          Download all your data and settings
                        </p>
                      </div>
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Clear Cache</Label>
                        <p className="text-sm text-muted-foreground">
                          Clear all cached data and temporary files
                        </p>
                      </div>
                      <Button variant="outline">
                        <Database className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-red-600">Delete Account</Label>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleSaveSettings} 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

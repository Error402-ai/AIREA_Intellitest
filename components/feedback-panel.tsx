"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Send, AlertCircle, CheckCircle, Clock, User, Reply } from "lucide-react"

interface Feedback {
  id: string
  type: "question_feedback" | "assessment_feedback" | "general_suggestion" | "bug_report"
  fromUserId: string
  fromUserRole: "student" | "teacher"
  toUserId?: string
  toUserRole?: "student" | "teacher"
  subject: string
  message: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "resolved" | "closed"
  relatedAssessmentId?: string
  relatedQuestionId?: string
  createdAt: string
  updatedAt: string
  responses: FeedbackResponse[]
}

interface FeedbackResponse {
  id: string
  feedbackId: string
  fromUserId: string
  fromUserRole: "student" | "teacher"
  message: string
  createdAt: string
}

interface FeedbackPanelProps {
  userRole: "student" | "teacher"
  relatedAssessmentId?: string
  relatedQuestionId?: string
  onFeedbackSubmitted?: (feedback: Feedback) => void
}

export function FeedbackPanel({ 
  userRole, 
  relatedAssessmentId, 
  relatedQuestionId, 
  onFeedbackSubmitted 
}: FeedbackPanelProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [newFeedback, setNewFeedback] = useState({
    type: "general_suggestion" as const,
    subject: "",
    message: "",
    priority: "medium" as const,
    toUserId: "",
    toUserRole: "" as "student" | "teacher" | ""
  })
  const [newResponse, setNewResponse] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFeedbacks()
  }, [])

  const loadFeedbacks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/feedback")
      if (response.ok) {
        const data = await response.json()
        setFeedbacks(data.feedbacks || [])
      }
    } catch (error) {
      console.error("Error loading feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFeedback = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newFeedback,
          relatedAssessmentId,
          relatedQuestionId,
          toUserId: newFeedback.toUserId || undefined,
          toUserRole: newFeedback.toUserRole || undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        setFeedbacks(prev => [data.feedback, ...prev])
        setIsCreateOpen(false)
        setNewFeedback({
          type: "general_suggestion",
          subject: "",
          message: "",
          priority: "medium",
          toUserId: "",
          toUserRole: ""
        })
        onFeedbackSubmitted?.(data.feedback)
      }
    } catch (error) {
      console.error("Error creating feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddResponse = async (feedbackId: string) => {
    if (!newResponse.trim()) return

    try {
      setLoading(true)
      const response = await fetch("/api/feedback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackId,
          response: newResponse
        })
      })

      if (response.ok) {
        const data = await response.json()
        setFeedbacks(prev => 
          prev.map(f => f.id === feedbackId ? data.feedback : f)
        )
        setNewResponse("")
        if (selectedFeedback?.id === feedbackId) {
          setSelectedFeedback(data.feedback)
        }
      }
    } catch (error) {
      console.error("Error adding response:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (feedbackId: string, status: Feedback["status"]) => {
    try {
      setLoading(true)
      const response = await fetch("/api/feedback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackId, status })
      })

      if (response.ok) {
        const data = await response.json()
        setFeedbacks(prev => 
          prev.map(f => f.id === feedbackId ? data.feedback : f)
        )
        if (selectedFeedback?.id === feedbackId) {
          setSelectedFeedback(data.feedback)
        }
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-800"
      case "in_progress": return "bg-blue-100 text-blue-800"
      case "resolved": return "bg-green-100 text-green-800"
      case "closed": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />
      case "in_progress": return <AlertCircle className="h-4 w-4" />
      case "resolved": return <CheckCircle className="h-4 w-4" />
      case "closed": return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredFeedbacks = feedbacks.filter(f => {
    if (relatedAssessmentId && f.relatedAssessmentId !== relatedAssessmentId) return false
    if (relatedQuestionId && f.relatedQuestionId !== relatedQuestionId) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Feedback & Communication</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              New Feedback
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Feedback</DialogTitle>
              <DialogDescription>
                Share your thoughts, report issues, or ask questions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select 
                  value={newFeedback.type} 
                  onValueChange={(value: any) => setNewFeedback(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="question_feedback">Question Feedback</SelectItem>
                    <SelectItem value="assessment_feedback">Assessment Feedback</SelectItem>
                    <SelectItem value="general_suggestion">General Suggestion</SelectItem>
                    <SelectItem value="bug_report">Bug Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <input
                  type="text"
                  value={newFeedback.subject}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  placeholder="Brief description of your feedback"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={newFeedback.message}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Detailed description of your feedback..."
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select 
                  value={newFeedback.priority} 
                  onValueChange={(value: any) => setNewFeedback(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {userRole === "teacher" && (
                <div>
                  <label className="text-sm font-medium">Send to Student (Optional)</label>
                  <input
                    type="text"
                    value={newFeedback.toUserId}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, toUserId: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-md"
                    placeholder="Student ID or email"
                  />
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={handleCreateFeedback} disabled={loading} className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Button>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({filteredFeedbacks.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filteredFeedbacks.filter(f => f.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({filteredFeedbacks.filter(f => f.status === "resolved").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {filteredFeedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              userRole={userRole}
              onView={() => {
                setSelectedFeedback(feedback)
                setIsViewOpen(true)
              }}
              onStatusUpdate={handleUpdateStatus}
              onAddResponse={handleAddResponse}
            />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3">
          {filteredFeedbacks.filter(f => f.status === "pending").map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              userRole={userRole}
              onView={() => {
                setSelectedFeedback(feedback)
                setIsViewOpen(true)
              }}
              onStatusUpdate={handleUpdateStatus}
              onAddResponse={handleAddResponse}
            />
          ))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-3">
          {filteredFeedbacks.filter(f => f.status === "resolved").map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              userRole={userRole}
              onView={() => {
                setSelectedFeedback(feedback)
                setIsViewOpen(true)
              }}
              onStatusUpdate={handleUpdateStatus}
              onAddResponse={handleAddResponse}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* Feedback Detail Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{selectedFeedback.subject}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedFeedback.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getPriorityColor(selectedFeedback.priority)}>
                    {selectedFeedback.priority} priority
                  </Badge>
                  <Badge className={getStatusColor(selectedFeedback.status)}>
                    {getStatusIcon(selectedFeedback.status)}
                    {selectedFeedback.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">{selectedFeedback.message}</p>
              </div>

              {/* Responses */}
              {selectedFeedback.responses.length > 0 && (
                <div className="space-y-3">
                  <h5 className="font-medium">Responses</h5>
                  {selectedFeedback.responses.map((response) => (
                    <div key={response.id} className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium capitalize">{response.fromUserRole}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(response.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{response.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Response */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Add Response</label>
                <Textarea
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  placeholder="Type your response..."
                  rows={3}
                />
                <Button 
                  onClick={() => handleAddResponse(selectedFeedback.id)}
                  disabled={!newResponse.trim() || loading}
                  size="sm"
                >
                  <Reply className="mr-2 h-4 w-4" />
                  Send Response
                </Button>
              </div>

              {/* Status Update (for teachers) */}
              {userRole === "teacher" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Update Status</label>
                  <div className="flex space-x-2">
                    {["pending", "in_progress", "resolved", "closed"].map((status) => (
                      <Button
                        key={status}
                        variant={selectedFeedback.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedFeedback.id, status as Feedback["status"])}
                        disabled={loading}
                      >
                        {status.replace("_", " ")}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface FeedbackCardProps {
  feedback: Feedback
  userRole: "student" | "teacher"
  onView: () => void
  onStatusUpdate: (feedbackId: string, status: Feedback["status"]) => void
  onAddResponse: (feedbackId: string) => void
}

function FeedbackCard({ feedback, userRole, onView, onStatusUpdate, onAddResponse }: FeedbackCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-800"
      case "in_progress": return "bg-blue-100 text-blue-800"
      case "resolved": return "bg-green-100 text-green-800"
      case "closed": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onView}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium mb-1">{feedback.subject}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {feedback.message}
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="capitalize">{feedback.fromUserRole}</span>
              <span>•</span>
              <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
              {feedback.responses.length > 0 && (
                <>
                  <span>•</span>
                  <span>{feedback.responses.length} responses</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-1 ml-4">
            <Badge className={getPriorityColor(feedback.priority)}>
              {feedback.priority}
            </Badge>
            <Badge className={getStatusColor(feedback.status)}>
              {feedback.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

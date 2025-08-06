"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Play,
  FileText,
  CheckCircle,
  Clock,
  BookOpen,
  Video,
  ExternalLink,
  Brain,
  Award,
  PartyPopper,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { getTrainingModule, getModuleProgress, updateUserProgress } from "@/lib/firebase-service"
import type { Database } from "@/lib/supabase"

type TrainingModule = Database["public"]["Tables"]["training_modules"]["Row"]
type UserProgress = Database["public"]["Tables"]["user_progress"]["Row"]

export default function ModulePage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [module, setModule] = useState<TrainingModule | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [certificateGenerated, setCertificateGenerated] = useState(false)
  const [completionMessage, setCompletionMessage] = useState("")

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
        return
      }
      fetchModuleData()
    }
  }, [params.id, user, authLoading, router])

  const fetchModuleData = async () => {
    if (!user) return

    try {
      // Fetch module details
      const moduleResult = await getTrainingModule(params.id as string)
      if (moduleResult.success) {
        setModule(moduleResult.data)
      }

      // Fetch user progress for this module
      const progressResult = await getModuleProgress(user.uid, params.id as string)
      if (progressResult.success) {
        setProgress(progressResult.data)
      }
    } catch (error) {
      console.error("Error fetching module data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (progressPercentage: number, completed = false) => {
    if (!user) return

    const updateData = {
      progress_percentage: progressPercentage,
      time_spent_minutes: (progress?.time_spent_minutes || 0) + 5, // Add 5 minutes
      ...(completed && { completed_at: new Date().toISOString() }),
    }

    const result = await updateUserProgress(user.uid, params.id as string, updateData)

    if (result.success && result.data) {
      setProgress(result.data as UserProgress)

      // Check if certificate was generated
      if (completed && result.certificate) {
        setCertificateGenerated(true)
        setCompletionMessage("🎉 Congratulations! You've earned your AI Compliance Certificate!")
      } else if (completed && result.message) {
        setCompletionMessage(result.message)
      }
    }
  }

  const handleStartModule = async () => {
    await updateProgress(10)
    setActiveTab("content")
  }

  const handleCompleteModule = async () => {
    await updateProgress(100, true)
    // Don't redirect immediately, show completion message first
    setTimeout(() => {
      if (certificateGenerated) {
        router.push("/certificate")
      } else {
        router.push("/dashboard")
      }
    }, 3000) // Wait 3 seconds to show the message
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading module...</p>
        </div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Module Not Found</h1>
          <p className="text-gray-600 mb-4">The requested module could not be found.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isCompleted = progress?.completed_at !== null
  const progressPercentage = progress?.progress_percentage || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
              <p className="text-gray-600">{module.description}</p>
            </div>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Certificate Generation Alert */}
        {certificateGenerated && (
          <Alert className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
            <Award className="h-4 w-4" />
            <AlertDescription className="flex items-center">
              <PartyPopper className="h-5 w-5 mr-2 text-green-600" />
              <div>
                <strong>🎉 Congratulations!</strong> You've completed all modules and earned your AI Compliance
                Certificate!
                <Link href="/certificate" className="ml-2 text-blue-600 hover:text-blue-700 underline">
                  View Certificate
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Completion Message */}
        {completionMessage && !certificateGenerated && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Module Completed!</strong> {completionMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Module Overview</CardTitle>
                    <CardDescription>Learn about the key concepts and objectives of this module</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Learning Objectives</h3>
                      <ul className="space-y-2">
                        {module.content?.learning_objectives?.map((objective: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Key Topics Covered</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {module.content?.topics?.map((topic: string, index: number) => (
                          <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                            <span className="text-sm font-medium text-blue-900">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {module.duration_minutes} minutes
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Presentation & Video
                      </div>
                    </div>

                    {!progress ? (
                      <Button onClick={handleStartModule} className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Start Module
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} />
                        <Button
                          onClick={() => setActiveTab("content")}
                          className="w-full"
                          variant={isCompleted ? "outline" : "default"}
                        >
                          {isCompleted ? "Review Content" : "Continue Learning"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="mt-6">
                <div className="space-y-6">
                  {/* Video Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Video className="h-5 w-5 mr-2" />
                        Training Video
                      </CardTitle>
                      <CardDescription>Watch the comprehensive training video for this module</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                        <iframe
                          src={module.video_url}
                          title={module.title}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="flex justify-between items-center">
                        <Button
                          onClick={() => updateProgress(Math.min(progressPercentage + 25, 75))}
                          disabled={progressPercentage >= 75}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {progressPercentage >= 75 ? "Video Completed" : "Mark Video as Watched"}
                        </Button>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">Duration: {module.duration_minutes} minutes</span>
                          <Button variant="outline" size="sm" asChild>
                            <a href={module.video_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open in YouTube
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Presentation Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Presentation Materials
                      </CardTitle>
                      <CardDescription>Access the comprehensive slide deck for this module</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{module.title} - Presentation</h3>
                        <p className="text-gray-600 mb-4">
                          Comprehensive slides covering all key concepts and practical applications
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button
                            variant="outline"
                            onClick={() => updateProgress(Math.min(progressPercentage + 25, 100))}
                            asChild
                          >
                            <a href={module.ppt_url} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-2" />
                              View Presentation
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={module.ppt_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open in Google Slides
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Concepts */}
                  {module.content?.key_concepts && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Brain className="h-5 w-5 mr-2" />
                          Key Concepts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-3">
                          {module.content.key_concepts.map((concept: string, index: number) => (
                            <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                              <span className="text-sm font-medium text-blue-900">{concept}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Completion Section */}
                  {progressPercentage >= 75 && !isCompleted && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-blue-900">Ready to Complete?</CardTitle>
                        <CardDescription className="text-blue-700">
                          You've made great progress! Complete this module to unlock the next one and potentially earn
                          your certificate.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button onClick={handleCompleteModule} className="w-full">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Complete
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Resources</CardTitle>
                    <CardDescription>Supplementary materials and references for deeper learning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Recommended Reading</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Industry best practices and case studies</li>
                          <li>• Regulatory guidelines and compliance frameworks</li>
                          <li>• Technical documentation and implementation guides</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">External Links</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Professional certification bodies</li>
                          <li>• Industry associations and forums</li>
                          <li>• Regulatory authority websites</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Tools & Templates</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Implementation checklists</li>
                          <li>• Risk assessment templates</li>
                          <li>• Compliance monitoring tools</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time Spent</span>
                    <span className="font-medium">{progress?.time_spent_minutes || 0} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge variant={isCompleted ? "default" : "secondary"}>
                      {isCompleted ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Module Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Module Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{module.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center text-sm">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Presentation & Video</span>
                </div>
                <div className="flex items-center text-sm">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Downloadable Resources</span>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                {isCompleted && (
                  <Link href="/certificate">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Award className="h-4 w-4 mr-2" />
                      View Certificate
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

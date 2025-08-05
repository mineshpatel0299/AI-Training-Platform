"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Video, Award, Clock, CheckCircle, Play, LogOut, User, TrendingUp } from "lucide-react"
import Link from "next/link"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { getTrainingModules, getUserProgress, getAIBasicsVideos } from "@/lib/firebase-service"
import type { Database } from "@/lib/supabase"

type TrainingModule = Database["public"]["Tables"]["training_modules"]["Row"]
type UserProgress = Database["public"]["Tables"]["user_progress"]["Row"]
type AIBasicsVideo = Database["public"]["Tables"]["ai_basics_videos"]["Row"]

export default function DashboardPage() {
  const { user, loading: authLoading, initialized } = useAuth()
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [videos, setVideos] = useState<AIBasicsVideo[]>([])
  const [loadingStates, setLoadingStates] = useState({
    modules: true,
    progress: true,
    videos: true,
  })
  const router = useRouter()

  useEffect(() => {
    if (initialized && !user) {
      router.push("/login")
      return
    }

    if (user) {
      // Fetch data in parallel for better performance
      fetchDataOptimized()
    }
  }, [user, initialized, router])

  const fetchDataOptimized = async () => {
    if (!user) return

    // Fetch all data in parallel instead of sequentially
    const fetchPromises = [
      getTrainingModules().then((result) => {
        if (result.success) {
          setModules(result.data || [])
        }
        setLoadingStates((prev) => ({ ...prev, modules: false }))
      }),
      getUserProgress(user.uid).then((result) => {
        if (result.success) {
          setProgress(result.data || [])
        }
        setLoadingStates((prev) => ({ ...prev, progress: false }))
      }),
      getAIBasicsVideos(5).then((result) => {
        if (result.success) {
          setVideos(result.data || [])
        }
        setLoadingStates((prev) => ({ ...prev, videos: false }))
      }),
    ]

    try {
      await Promise.all(fetchPromises)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      // Set all loading states to false even on error
      setLoadingStates({
        modules: false,
        progress: false,
        videos: false,
      })
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getModuleProgress = (moduleId: string) => {
    const moduleProgress = progress.find((p) => p.module_id === moduleId)
    return moduleProgress?.progress_percentage || 0
  }

  const isModuleCompleted = (moduleId: string) => {
    const moduleProgress = progress.find((p) => p.module_id === moduleId)
    return moduleProgress?.completed_at !== null
  }

  const overallProgress =
    modules.length > 0 ? Math.round(progress.reduce((acc, p) => acc + p.progress_percentage, 0) / modules.length) : 0

  const completedModules = progress.filter((p) => p.completed_at !== null).length

  // Show loading only while auth is initializing
  if (authLoading || !initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    )
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null
  }

  const isAnyDataLoading = Object.values(loadingStates).some((loading) => loading)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Always show immediately */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AI Compliance Academy</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.displayName || user.email}</span>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section - Always show immediately */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.displayName || "Learner"}!</h1>
          <p className="text-gray-600">Continue your AI compliance training journey</p>
        </div>

        {/* Progress Overview - Show with skeleton loading */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStates.progress || loadingStates.modules ? (
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{overallProgress}%</div>
                  <Progress value={overallProgress} className="mt-2" />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Modules</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStates.progress || loadingStates.modules ? (
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {completedModules}/{modules.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{modules.length - completedModules} remaining</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificate Status</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStates.progress || loadingStates.modules ? (
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {completedModules === modules.length ? "Ready!" : "In Progress"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedModules === modules.length
                      ? "Claim your certificate"
                      : `Complete ${modules.length - completedModules} more modules`}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Training Modules */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Training Modules</h2>
              {!loadingStates.modules && <Badge variant="secondary">{modules.length} modules</Badge>}
            </div>

            <div className="space-y-4">
              {loadingStates.modules
                ? // Skeleton loading for modules
                  Array.from({ length: 5 }).map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-2">
                              <div className="h-6 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-8 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                : modules.map((module, index) => {
                    const moduleProgress = getModuleProgress(module.id)
                    const isCompleted = isModuleCompleted(module.id)

                    return (
                      <Card key={module.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline">Module {index + 1}</Badge>
                                {isCompleted && (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Completed
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-lg">{module.title}</CardTitle>
                              <CardDescription className="mt-1">{module.description}</CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <Clock className="h-4 w-4 mr-1" />
                                {module.duration_minutes} min
                              </div>
                              <Link href={`/modules/${module.id}`}>
                                <Button size="sm">
                                  {moduleProgress > 0 ? "Continue" : "Start"}
                                  <Play className="h-4 w-4 ml-2" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardHeader>
                        {moduleProgress > 0 && (
                          <CardContent>
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                              <span>Progress</span>
                              <span>{moduleProgress}%</span>
                            </div>
                            <Progress value={moduleProgress} />
                          </CardContent>
                        )}
                      </Card>
                    )
                  })}
            </div>

            {!loadingStates.modules && !loadingStates.progress && completedModules === modules.length && (
              <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Award className="h-6 w-6 text-green-600" />
                    <CardTitle className="text-green-800">Congratulations!</CardTitle>
                  </div>
                  <CardDescription className="text-green-700">
                    You've completed all training modules. Claim your certificate now!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/certificate">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Award className="h-4 w-4 mr-2" />
                      Get Certificate
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Basics Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  AI Basics Videos
                </CardTitle>
                <CardDescription>Quick introduction videos to AI concepts</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingStates.videos ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 animate-pulse">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {videos.map((video, index) => (
                      <div key={video.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                          <p className="text-xs text-gray-500">{video.duration_minutes} min</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <Link href="/ai-basics">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Videos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingStates.progress ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Time Spent</span>
                      <span className="font-medium">
                        {Math.round(progress.reduce((acc, p) => acc + p.time_spent_minutes, 0) / 60)}h
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Modules Started</span>
                      <span className="font-medium">{progress.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="font-medium">{overallProgress}%</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

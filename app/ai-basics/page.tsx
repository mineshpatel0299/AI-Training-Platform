"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, ArrowLeft, Clock, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { getAIBasicsVideos } from "@/lib/firebase-service"
import type { Database } from "@/lib/supabase"
import { auth, db } from "@/lib/firebase"

type AIBasicsVideo = Database["public"]["Tables"]["ai_basics_videos"]["Row"]

export default function AIBasicsPage() {
  const { user, loading: authLoading } = useAuth()
  const [videos, setVideos] = useState<AIBasicsVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<AIBasicsVideo | null>(null)
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
        return
      }
      fetchVideos()
    }
  }, [user, authLoading, router])

  const fetchVideos = async () => {
    try {
      console.log("🔍 Starting to fetch AI basics videos...")
      console.log("🔗 Firebase config check:", {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasAuth: !!auth,
        hasDb: !!db,
      })

      const result = await getAIBasicsVideos()
      console.log("📊 Raw fetch result:", result)

      if (result.success) {
        const videoData = result.data || []
        console.log(`✅ Successfully fetched ${videoData.length} videos`)
        console.log("🎬 Video data sample:", videoData.slice(0, 2))

        setVideos(videoData)
        if (videoData.length > 0) {
          setSelectedVideo(videoData[0])
          console.log("🎯 Selected first video:", videoData[0].title)
        } else {
          console.warn("⚠️ No videos found in database")
        }
      } else {
        console.error("❌ Failed to fetch videos:", result.error)
      }
    } catch (error) {
      console.error("💥 Error in fetchVideos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoSelect = (video: AIBasicsVideo) => {
    setSelectedVideo(video)
    setWatchedVideos((prev) => new Set([...prev, video.id]))
  }

  const handleVideoComplete = () => {
    if (selectedVideo) {
      setWatchedVideos((prev) => new Set([...prev, selectedVideo.id]))
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    )
  }

  const totalDuration = videos.reduce((total, video) => total + (video.duration_minutes || 0), 0)
  const watchedCount = watchedVideos.size
  const completionPercentage = videos.length > 0 ? Math.round((watchedCount / videos.length) * 100) : 0

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
              <h1 className="text-2xl font-bold text-gray-900">AI Basics Video Library</h1>
              <p className="text-gray-600">Top 10 essential AI concepts explained</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Progress: {watchedCount}/{videos.length} videos ({completionPercentage}%)
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3">
            {selectedVideo ? (
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedVideo.title}</CardTitle>
                      <CardDescription className="mt-2">{selectedVideo.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {selectedVideo.duration_minutes} min
                      </Badge>
                      {watchedVideos.has(selectedVideo.id) && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Watched
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    {selectedVideo.video_url ? (
                      <iframe
                        src={selectedVideo.video_url}
                        title={selectedVideo.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => console.log("🎬 Video iframe loaded")}
                        onError={() => console.error("❌ Video iframe failed to load")}
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <div className="text-center">
                          <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p>Video URL not available</p>
                          <p className="text-sm opacity-75">Video ID: {selectedVideo.id}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={handleVideoComplete}
                        variant={watchedVideos.has(selectedVideo.id) ? "outline" : "default"}
                      >
                        {watchedVideos.has(selectedVideo.id) ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Mark as Watched
                          </>
                        )}
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={selectedVideo.video_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in YouTube
                        </a>
                      </Button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Video {videos.findIndex((v) => v.id === selectedVideo.id) + 1} of {videos.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : videos.length === 0 && !loading ? (
              <Card className="mb-6">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No videos found</p>
                    <p className="text-sm text-gray-500">Please run the seed script to add video data</p>
                    <Button onClick={fetchVideos} variant="outline" className="mt-4 bg-transparent">
                      Retry Loading Videos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-6">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select a video to start learning</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress Overview */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-blue-600 mr-2" />
                  Your Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">{watchedCount}</div>
                    <div className="text-sm text-blue-700">Videos Watched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">{completionPercentage}%</div>
                    <div className="text-sm text-blue-700">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">{totalDuration}</div>
                    <div className="text-sm text-blue-700">Total Minutes</div>
                  </div>
                </div>
                {completionPercentage === 100 && (
                  <div className="mt-4 text-center">
                    <Badge className="bg-green-100 text-green-800 text-base px-4 py-2">
                      🎉 Congratulations! You've completed all AI basics videos!
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Video List Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Video Library</CardTitle>
                <CardDescription>
                  {videos.length} videos • {totalDuration} minutes total
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedVideo?.id === video.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            watchedVideos.has(video.id)
                              ? "bg-green-100 text-green-800"
                              : selectedVideo?.id === video.id
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {watchedVideos.has(video.id) ? <CheckCircle className="h-4 w-4" /> : index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{video.title}</h4>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {video.duration_minutes} min
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ready for More?</CardTitle>
                <CardDescription>Continue with our comprehensive training modules</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button className="w-full">
                    Start Training Modules
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

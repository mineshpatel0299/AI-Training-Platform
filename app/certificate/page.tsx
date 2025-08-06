"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Download, Share2, ArrowLeft, Calendar, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import {
  getUserCertificate,
  createCertificate,
  getTrainingModules,
  getUserProgress,
  getUserProfile,
} from "@/lib/firebase-service"

export default function CertificatePage() {
  const { user, loading: authLoading, initialized } = useAuth()
  const [certificate, setCertificate] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [canGenerateCertificate, setCanGenerateCertificate] = useState(false)
  const [loadingStates, setLoadingStates] = useState({
    certificate: true,
    profile: true,
    eligibility: true,
  })
  const [generating, setGenerating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (initialized && !user) {
      router.push("/login")
      return
    }

    if (user) {
      fetchCertificateDataOptimized()
    }
  }, [user, initialized, router])

  const fetchCertificateDataOptimized = async () => {
    if (!user) return

    // Fetch all data in parallel for better performance
    const fetchPromises = [
      // Check existing certificate
      getUserCertificate(user.uid).then((result) => {
        if (result.success && result.data) {
          setCertificate(result.data)
        }
        setLoadingStates((prev) => ({ ...prev, certificate: false }))
      }),

      // Get user profile
      getUserProfile(user.uid).then((result) => {
        if (result.success) {
          setUserProfile(result.data)
        }
        setLoadingStates((prev) => ({ ...prev, profile: false }))
      }),

      // Check eligibility for certificate generation
      Promise.all([getTrainingModules(), getUserProgress(user.uid)]).then(([modulesResult, progressResult]) => {
        if (modulesResult.success && progressResult.success) {
          const modules = modulesResult.data || []
          const progress = progressResult.data || []
          const completedProgress = progress.filter((p) => p.completed_at !== null)

          setCanGenerateCertificate(completedProgress.length >= modules.length && modules.length > 0)
        }
        setLoadingStates((prev) => ({ ...prev, eligibility: false }))
      }),
    ]

    try {
      await Promise.all(fetchPromises)
    } catch (error) {
      console.error("Error fetching certificate data:", error)
      // Set all loading states to false even on error
      setLoadingStates({
        certificate: false,
        profile: false,
        eligibility: false,
      })
    }
  }

  const generateCertificate = async () => {
    if (!user || !userProfile) return

    setGenerating(true)
    try {
      const certificateNumber = `ACA-${Date.now()}-${user.uid.slice(0, 8).toUpperCase()}`
      const certificateData = {
        user_name: userProfile.full_name || user.displayName || user.email,
        company: userProfile.company,
        completion_date: new Date().toISOString(),
        modules_completed: 5,
        total_hours: 4.2,
      }

      const result = await createCertificate(user.uid, {
        certificate_number: certificateNumber,
        certificate_data: certificateData,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      })

      if (result.success && result.data) {
        setCertificate(result.data)
      }
    } catch (error) {
      console.error("Error generating certificate:", error)
    } finally {
      setGenerating(false)
    }
  }

  // Show loading only while auth is initializing
  if (authLoading || !initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Award className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Certificate of Completion</h1>
              <p className="text-gray-600">AI Compliance Training Program</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Show certificate if it exists or is loading */}
        {(certificate || loadingStates.certificate) && (
          <div className="max-w-4xl mx-auto">
            {/* Certificate Display */}
            <Card className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="p-12">
                {loadingStates.certificate ? (
                  // Certificate loading skeleton
                  <div className="text-center space-y-6 animate-pulse">
                    <div className="space-y-2">
                      <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto"></div>
                      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                    <div className="space-y-4 py-8">
                      <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
                      <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                      <div className="h-20 bg-gray-200 rounded w-full mx-auto"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 py-6">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="text-center space-y-2">
                          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : certificate ? (
                  // Actual certificate content
                  <div className="text-center space-y-6">
                    {/* Header */}
                    <div className="space-y-2">
                      <Award className="h-16 w-16 text-blue-600 mx-auto" />
                      <h2 className="text-3xl font-bold text-gray-900">Certificate of Completion</h2>
                      <p className="text-lg text-gray-600">AI Compliance Training Program</p>
                    </div>

                    {/* Recipient */}
                    <div className="space-y-4 py-8">
                      <p className="text-lg text-gray-700">This is to certify that</p>
                      <h3 className="text-4xl font-bold text-blue-900">{certificate.certificate_data.user_name}</h3>
                      {certificate.certificate_data.company && (
                        <p className="text-lg text-gray-700">
                          of <span className="font-semibold">{certificate.certificate_data.company}</span>
                        </p>
                      )}
                      <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        has successfully completed the comprehensive AI Compliance Training Program, demonstrating
                        proficiency in artificial intelligence applications for compliance and regulatory management.
                      </p>
                    </div>

                    {/* Details */}
                    <div className="grid md:grid-cols-3 gap-6 py-6 border-t border-b border-blue-200">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Award className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-semibold">Modules Completed</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {certificate.certificate_data.modules_completed}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-semibold">Completion Date</span>
                        </div>
                        <p className="text-lg font-bold text-blue-900">
                          {new Date(certificate.certificate_data.completion_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <User className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-semibold">Training Hours</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">{certificate.certificate_data.total_hours}h</p>
                      </div>
                    </div>

                    {/* Certificate Number */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Certificate Number</p>
                      <p className="text-lg font-mono font-bold text-gray-900">{certificate.certificate_number}</p>
                    </div>

                    {/* Validity */}
                    <div className="text-sm text-gray-600">
                      <p>Valid until: {new Date(certificate.expires_at).toLocaleDateString()}</p>
                      <p className="mt-1">Issued by AI Compliance Academy</p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Actions - Show only if certificate exists and is not loading */}
            {certificate && !loadingStates.certificate && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Certificate
                </Button>
              </div>
            )}

            {/* Certificate Info - Show only if certificate exists and is not loading */}
            {certificate && !loadingStates.certificate && (
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Program Details</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• 5 comprehensive training modules</li>
                        <li>• 4.2 hours of professional development</li>
                        <li>• Industry-focused AI compliance content</li>
                        <li>• Practical implementation strategies</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Verification</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Certificate Number: {certificate.certificate_number}</li>
                        <li>• Issued: {new Date(certificate.issued_at).toLocaleDateString()}</li>
                        <li>• Valid until: {new Date(certificate.expires_at).toLocaleDateString()}</li>
                        <li>• Verification available online</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Show "not available" message if no certificate and not loading */}
        {!certificate && !loadingStates.certificate && (
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <CardTitle className="text-2xl">
                  {loadingStates.eligibility ? "Checking Eligibility..." : "Certificate Not Available"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {loadingStates.eligibility ? (
                  // Loading eligibility check
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-center">
                          <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 justify-center">
                      <div className="h-10 bg-gray-200 rounded w-32"></div>
                      <div className="h-10 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600">
                      {canGenerateCertificate
                        ? "You're eligible for a certificate! Generate it now."
                        : "Complete all training modules to earn your certificate of completion."}
                    </p>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Requirements:</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <Award className="h-4 w-4 text-green-500 mr-2" />
                          Complete all 5 training modules
                        </li>
                        <li className="flex items-center">
                          <Award className="h-4 w-4 text-green-500 mr-2" />
                          Pass all module assessments
                        </li>
                        <li className="flex items-center">
                          <Award className="h-4 w-4 text-green-500 mr-2" />
                          Minimum 4 hours of training time
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      {canGenerateCertificate ? (
                        <Button onClick={generateCertificate} disabled={generating}>
                          {generating ? "Generating..." : "Generate Certificate"}
                        </Button>
                      ) : (
                        <Link href="/dashboard">
                          <Button>Continue Training</Button>
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

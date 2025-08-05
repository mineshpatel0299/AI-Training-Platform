import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, Award, BookOpen, Video, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AI Compliance Academy</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Professional AI Training Platform</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">Master AI in Compliance & Insurance</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Comprehensive training modules designed for compliance professionals. Learn how AI is transforming
            regulatory compliance, risk management, and insurance operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built specifically for compliance professionals with industry-focused content and practical applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Compliance Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Specialized content for regulatory compliance and risk management professionals.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>5 Core Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive curriculum covering AI fundamentals to implementation strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Video className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Rich Media Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Interactive presentations, videos, and hands-on learning materials.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Certification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Earn professional certificates upon successful completion of all modules.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Training Modules Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Training Modules</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Five comprehensive modules designed to take you from AI basics to advanced implementation strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Introduction to AI",
                duration: "45 min",
                topics: ["AI Fundamentals", "Business Applications", "Industry Impact"],
              },
              {
                title: "AI in Insurance",
                duration: "60 min",
                topics: ["Claims Processing", "Risk Assessment", "Fraud Detection"],
              },
              {
                title: "AI in Compliance",
                duration: "50 min",
                topics: ["Regulatory Monitoring", "Automated Reporting", "Risk Management"],
              },
              {
                title: "AI Ethics & Governance",
                duration: "40 min",
                topics: ["Ethical AI", "Bias Prevention", "Governance Frameworks"],
              },
              {
                title: "Implementation Strategy",
                duration: "55 min",
                topics: ["Planning", "Change Management", "ROI Measurement"],
              },
            ].map((module, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Module {index + 1}</Badge>
                    <span className="text-sm text-gray-500">{module.duration}</span>
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {module.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            <Card className="hover:shadow-lg transition-shadow border-dashed border-2 border-blue-300 bg-blue-50">
              <CardHeader>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Bonus
                </Badge>
                <CardTitle className="text-lg text-blue-900">AI Basics Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4">Top 10 essential AI concepts explained in bite-sized videos</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-blue-600">
                    <Video className="h-4 w-4 mr-2 flex-shrink-0" />
                    10 focused videos
                  </li>
                  <li className="flex items-center text-sm text-blue-600">
                    <Video className="h-4 w-4 mr-2 flex-shrink-0" />
                    8-15 min each
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Compliance Career?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of compliance professionals who are already leveraging AI to enhance their work and advance
            their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 bg-transparent"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">AI Compliance Academy</span>
              </div>
              <p className="text-gray-400">Professional AI training for compliance and insurance professionals.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/modules" className="hover:text-white">
                    Training Modules
                  </Link>
                </li>
                <li>
                  <Link href="/certificates" className="hover:text-white">
                    Certificates
                  </Link>
                </li>
                <li>
                  <Link href="/progress" className="hover:text-white">
                    Progress Tracking
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Compliance Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

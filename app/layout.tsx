import type React from "react"
import type { Metadata } from "next"
// import { Inter } from "next/font/google"
import "./globals.css"

// Temporarily using system fonts due to network issues with Google Fonts
// const inter = Inter({ 
//   subsets: ["latin"],
//   display: 'swap',
//   fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
// })

export const metadata: Metadata = {
  title: "AI Compliance Academy",
  description: "Professional AI training platform for compliance professionals",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div id="root">{children}</div>
      </body>
    </html>
  )
}

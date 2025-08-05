import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Keep the Database types for compatibility
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company: string | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company?: string | null
          role?: string | null
        }
        Update: {
          full_name?: string | null
          company?: string | null
          role?: string | null
        }
      }
      training_modules: {
        Row: {
          id: string
          title: string
          description: string | null
          order_index: number
          duration_minutes: number | null
          ppt_url: string | null
          video_url: string
          content: any
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      ai_basics_videos: {
        Row: {
          id: string
          title: string
          description: string | null
          video_url: string
          thumbnail_url: string | null
          duration_minutes: number | null
          order_index: number
          is_active: boolean
          created_at: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          module_id: string
          completed_at: string | null
          progress_percentage: number
          time_spent_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          module_id: string
          progress_percentage?: number
          time_spent_minutes?: number
        }
        Update: {
          progress_percentage?: number
          time_spent_minutes?: number
          completed_at?: string | null
        }
      }
      certificates: {
        Row: {
          id: string
          user_id: string
          certificate_number: string
          issued_at: string
          expires_at: string | null
          certificate_data: any
          is_valid: boolean
        }
      }
    }
  }
}

// Enable persistence for offline support
if (typeof window !== "undefined") {
  // Only run on client side
  auth.useDeviceLanguage()
}

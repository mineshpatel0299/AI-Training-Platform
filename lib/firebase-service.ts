import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  addDoc,
} from "firebase/firestore"
import { db } from "./firebase"

// Cache for frequently accessed data
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

// User Profile Service
export const createUserProfile = async (
  userId: string,
  userData: {
    email: string
    full_name?: string
    company?: string
    role?: string
  },
) => {
  try {
    await setDoc(doc(db, "user_profiles", userId), {
      ...userData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error creating user profile:", error)
    return { success: false, error }
  }
}

export const getUserProfile = async (userId: string) => {
  try {
    const cacheKey = `user_profile_${userId}`
    const cached = getCachedData(cacheKey)
    if (cached) {
      return { success: true, data: cached }
    }

    const docRef = doc(db, "user_profiles", userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() }
      setCachedData(cacheKey, data)
      return { success: true, data }
    } else {
      return { success: false, error: "Profile not found" }
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    return { success: false, error }
  }
}

// Training Modules Service
export const getTrainingModules = async () => {
  try {
    const cacheKey = "training_modules"
    const cached = getCachedData(cacheKey)
    if (cached) {
      return { success: true, data: cached }
    }

    const q = query(collection(db, "training_modules"), where("is_active", "==", true), orderBy("order_index"))
    const querySnapshot = await getDocs(q)
    const modules = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    setCachedData(cacheKey, modules)
    return { success: true, data: modules }
  } catch (error) {
    console.error("Error getting training modules:", error)
    return { success: false, error }
  }
}

export const getTrainingModule = async (moduleId: string) => {
  try {
    const cacheKey = `training_module_${moduleId}`
    const cached = getCachedData(cacheKey)
    if (cached) {
      return { success: true, data: cached }
    }

    const docRef = doc(db, "training_modules", moduleId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() }
      setCachedData(cacheKey, data)
      return { success: true, data }
    } else {
      return { success: false, error: "Module not found" }
    }
  } catch (error) {
    console.error("Error getting training module:", error)
    return { success: false, error }
  }
}

// User Progress Service
export const getUserProgress = async (userId: string) => {
  try {
    const cacheKey = `user_progress_${userId}`
    const cached = getCachedData(cacheKey)
    if (cached) {
      return { success: true, data: cached }
    }

    const q = query(collection(db, "user_progress"), where("user_id", "==", userId))
    const querySnapshot = await getDocs(q)
    const progress = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    setCachedData(cacheKey, progress)
    return { success: true, data: progress }
  } catch (error) {
    console.error("Error getting user progress:", error)
    return { success: false, error }
  }
}

export const getModuleProgress = async (userId: string, moduleId: string) => {
  try {
    const cacheKey = `module_progress_${userId}_${moduleId}`
    const cached = getCachedData(cacheKey)
    if (cached) {
      return { success: true, data: cached }
    }

    const q = query(collection(db, "user_progress"), where("user_id", "==", userId), where("module_id", "==", moduleId))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      const data = { id: doc.id, ...doc.data() }
      setCachedData(cacheKey, data)
      return { success: true, data }
    } else {
      return { success: true, data: null }
    }
  } catch (error) {
    console.error("Error getting module progress:", error)
    return { success: false, error }
  }
}

export const updateUserProgress = async (
  userId: string,
  moduleId: string,
  progressData: {
    progress_percentage?: number
    time_spent_minutes?: number
    completed_at?: string | null
  },
) => {
  try {
    const q = query(collection(db, "user_progress"), where("user_id", "==", userId), where("module_id", "==", moduleId))
    const querySnapshot = await getDocs(q)

    const updateData = {
      ...progressData,
      updated_at: serverTimestamp(),
    }

    if (!querySnapshot.empty) {
      // Update existing progress
      const docRef = querySnapshot.docs[0].ref
      await updateDoc(docRef, updateData)

      // Clear cache for this user's progress
      cache.delete(`user_progress_${userId}`)
      cache.delete(`module_progress_${userId}_${moduleId}`)

      return { success: true, data: { id: docRef.id, ...updateData } }
    } else {
      // Create new progress record
      const docRef = await addDoc(collection(db, "user_progress"), {
        user_id: userId,
        module_id: moduleId,
        progress_percentage: 0,
        time_spent_minutes: 0,
        ...updateData,
        created_at: serverTimestamp(),
      })

      // Clear cache for this user's progress
      cache.delete(`user_progress_${userId}`)

      return { success: true, data: { id: docRef.id, ...updateData } }
    }
  } catch (error) {
    console.error("Error updating user progress:", error)
    return { success: false, error }
  }
}

// AI Basics Videos Service - Enhanced with better debugging
export const getAIBasicsVideos = async (limitCount?: number) => {
  try {
    console.log("🔍 getAIBasicsVideos called with limit:", limitCount)
    console.log("🔗 Database instance:", !!db)
    console.log("🔗 Environment check:", {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    })

    // Skip cache for debugging
    // const cacheKey = `ai_basics_videos_${limitCount || "all"}`
    // const cached = getCachedData(cacheKey)
    // if (cached) {
    //   console.log("📦 Returning cached AI basics videos:", cached.length)
    //   return { success: true, data: cached }
    // }

    console.log("🔍 Fetching AI basics videos from Firestore...")

    // Test 1: Basic collection access
    console.log("🧪 Test 1: Basic collection access...")
    try {
      const basicQuery = collection(db, "ai_basics_videos")
      const basicSnapshot = await getDocs(basicQuery)
      console.log(`📊 Basic query returned ${basicSnapshot.size} total documents`)

      if (basicSnapshot.size === 0) {
        console.log("❌ No documents found in ai_basics_videos collection")
        return { success: true, data: [] }
      }

      // Log first few documents for debugging
      basicSnapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data()
        console.log(`📄 Document ${index + 1}:`, {
          id: doc.id,
          title: data.title,
          is_active: data.is_active,
          order_index: data.order_index,
        })
      })
    } catch (basicError) {
      console.error("❌ Basic collection access failed:", basicError)
      return { success: false, error: basicError }
    }

    // Test 2: Try without orderBy first
    console.log("🧪 Test 2: Query with is_active filter only...")
    try {
      const activeOnlyQuery = query(collection(db, "ai_basics_videos"), where("is_active", "==", true))
      const activeOnlySnapshot = await getDocs(activeOnlyQuery)
      console.log(`📊 Active-only query returned ${activeOnlySnapshot.size} documents`)

      if (activeOnlySnapshot.size > 0) {
        const videos = activeOnlySnapshot.docs.map((doc) => {
          const data = { id: doc.id, ...doc.data() }
          console.log("🎬 Processing video:", {
            id: data.id,
            title: data.title,
            is_active: data.is_active,
            order_index: data.order_index,
          })
          return data
        })

        // Sort manually by order_index
        videos.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))

        // Apply limit if specified
        const finalVideos = limitCount ? videos.slice(0, limitCount) : videos

        console.log(`✅ Successfully processed ${finalVideos.length} videos`)
        // setCachedData(cacheKey, finalVideos)
        return { success: true, data: finalVideos }
      }
    } catch (activeError) {
      console.error("❌ Active-only query failed:", activeError)
    }

    // Test 3: Try with orderBy (might fail if index doesn't exist)
    console.log("🧪 Test 3: Query with orderBy...")
    try {
      let q = query(collection(db, "ai_basics_videos"), where("is_active", "==", true), orderBy("order_index"))

      if (limitCount) {
        q = query(q, limit(limitCount))
        console.log(`📊 Limiting to ${limitCount} videos`)
      }

      console.log("🔍 Executing Firestore query with orderBy...")
      const querySnapshot = await getDocs(q)
      console.log(`📊 Ordered query returned ${querySnapshot.size} documents`)

      const videos = querySnapshot.docs.map((doc) => {
        const data = { id: doc.id, ...doc.data() }
        console.log("🎬 Processing ordered video:", {
          id: data.id,
          title: data.title,
          is_active: data.is_active,
          order_index: data.order_index,
        })
        return data
      })

      console.log(`✅ Successfully processed ${videos.length} ordered videos`)
      // setCachedData(cacheKey, videos)
      return { success: true, data: videos }
    } catch (orderError) {
      console.error("❌ Ordered query failed:", orderError)
      console.error("❌ This might be due to missing Firestore index")

      // Fallback: return unordered results
      console.log("🔄 Falling back to unordered results...")
      try {
        const fallbackQuery = query(collection(db, "ai_basics_videos"), where("is_active", "==", true))
        const fallbackSnapshot = await getDocs(fallbackQuery)
        const videos = fallbackSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

        // Sort manually
        videos.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))

        const finalVideos = limitCount ? videos.slice(0, limitCount) : videos
        return { success: true, data: finalVideos }
      } catch (fallbackError) {
        console.error("❌ Fallback query also failed:", fallbackError)
        return { success: false, error: fallbackError }
      }
    }

    // If we get here, something went wrong
    return { success: true, data: [] }
  } catch (error) {
    console.error("❌ Error getting AI basics videos:", error)
    console.error("❌ Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    })
    return { success: false, error }
  }
}

// Certificates Service
export const getUserCertificate = async (userId: string) => {
  try {
    const cacheKey = `user_certificate_${userId}`
    const cached = getCachedData(cacheKey)
    if (cached) {
      return { success: true, data: cached }
    }

    const q = query(collection(db, "certificates"), where("user_id", "==", userId))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      const data = { id: doc.id, ...doc.data() }
      setCachedData(cacheKey, data)
      return { success: true, data }
    } else {
      return { success: true, data: null }
    }
  } catch (error) {
    console.error("Error getting user certificate:", error)
    return { success: false, error }
  }
}

export const createCertificate = async (
  userId: string,
  certificateData: {
    certificate_number: string
    certificate_data: any
    expires_at?: string
  },
) => {
  try {
    const docRef = await addDoc(collection(db, "certificates"), {
      user_id: userId,
      ...certificateData,
      issued_at: serverTimestamp(),
      is_valid: true,
    })

    // Clear cache for this user's certificate
    cache.delete(`user_certificate_${userId}`)

    return { success: true, data: { id: docRef.id, ...certificateData } }
  } catch (error) {
    console.error("Error creating certificate:", error)
    return { success: false, error }
  }
}

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

// Enhanced updateUserProgress with certificate generation logic
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

    let progressResult

    if (!querySnapshot.empty) {
      // Update existing progress
      const docRef = querySnapshot.docs[0].ref
      await updateDoc(docRef, updateData)
      progressResult = { id: docRef.id, ...updateData }
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
      progressResult = { id: docRef.id, ...updateData }
    }

    // Clear cache for this user's progress
    cache.delete(`user_progress_${userId}`)
    cache.delete(`module_progress_${userId}_${moduleId}`)

    // Check if user completed all modules and auto-generate certificate
    if (progressData.completed_at) {
      console.log("🎓 Module completed, checking for certificate eligibility...")
      await checkAndGenerateCertificate(userId)
    }

    return { success: true, data: progressResult }
  } catch (error) {
    console.error("Error updating user progress:", error)
    return { success: false, error }
  }
}

// New function to check and auto-generate certificate
export const checkAndGenerateCertificate = async (userId: string) => {
  try {
    console.log("🔍 Checking certificate eligibility for user:", userId)

    // Check if user already has a certificate
    const existingCertificate = await getUserCertificate(userId)
    if (existingCertificate.success && existingCertificate.data) {
      console.log("📜 User already has a certificate")
      return { success: true, message: "Certificate already exists" }
    }

    // Get all active modules
    const modulesResult = await getTrainingModules()
    if (!modulesResult.success) {
      console.error("❌ Failed to fetch modules")
      return { success: false, error: "Failed to fetch modules" }
    }

    const modules = modulesResult.data || []
    const totalModules = modules.length

    // Get user progress
    const progressResult = await getUserProgress(userId)
    if (!progressResult.success) {
      console.error("❌ Failed to fetch user progress")
      return { success: false, error: "Failed to fetch user progress" }
    }

    const progress = progressResult.data || []
    const completedModules = progress.filter((p) => p.completed_at !== null)

    console.log(`📊 Progress check: ${completedModules.length}/${totalModules} modules completed`)

    // Check if all modules are completed
    if (completedModules.length >= totalModules && totalModules > 0) {
      console.log("🎉 All modules completed! Generating certificate...")

      // Get user profile for certificate data
      const profileResult = await getUserProfile(userId)
      const userProfile = profileResult.success ? profileResult.data : null

      // Calculate total training time
      const totalTimeSpent = progress.reduce((total, p) => total + (p.time_spent_minutes || 0), 0)
      const totalHours = Math.round((totalTimeSpent / 60) * 10) / 10

      // Generate certificate
      const certificateNumber = `ACA-${Date.now()}-${userId.slice(0, 8).toUpperCase()}`
      const certificateData = {
        user_name: userProfile?.full_name || "AI Compliance Professional",
        company: userProfile?.company || "",
        completion_date: new Date().toISOString(),
        modules_completed: totalModules,
        total_hours: totalHours,
        modules_list: modules.map((m) => ({
          title: m.title,
          duration: m.duration_minutes,
          completed_date: completedModules.find((p) => p.module_id === m.id)?.completed_at,
        })),
      }

      const certificateResult = await createCertificate(userId, {
        certificate_number: certificateNumber,
        certificate_data: certificateData,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      })

      if (certificateResult.success) {
        console.log("🎓 Certificate generated successfully!")
        return { success: true, certificate: certificateResult.data, message: "Certificate generated!" }
      } else {
        console.error("❌ Failed to generate certificate")
        return { success: false, error: "Failed to generate certificate" }
      }
    } else {
      console.log(`📚 Still need to complete ${totalModules - completedModules.length} more modules`)
      return { success: true, message: `${totalModules - completedModules.length} modules remaining` }
    }
  } catch (error) {
    console.error("❌ Error checking certificate eligibility:", error)
    return { success: false, error: error.message }
  }
}

// AI Basics Videos Service - Enhanced with better debugging
export const getAIBasicsVideos = async (limitCount?: number) => {
  try {
    console.log("🔍 getAIBasicsVideos called with limit:", limitCount)

    const cacheKey = `ai_basics_videos_${limitCount || "all"}`
    const cached = getCachedData(cacheKey)
    if (cached) {
      console.log("📦 Returning cached AI basics videos:", cached.length)
      return { success: true, data: cached }
    }

    console.log("🔍 Fetching AI basics videos from Firestore...")

    // Try with orderBy first, fallback to manual sorting
    let videos = []
    try {
      let q = query(collection(db, "ai_basics_videos"), where("is_active", "==", true), orderBy("order_index"))
      if (limitCount) {
        q = query(q, limit(limitCount))
      }
      const querySnapshot = await getDocs(q)
      videos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (orderError) {
      console.warn("⚠️ OrderBy failed, using manual sorting")
      const fallbackQuery = query(collection(db, "ai_basics_videos"), where("is_active", "==", true))
      const fallbackSnapshot = await getDocs(fallbackQuery)
      videos = fallbackSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      videos.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      if (limitCount) {
        videos = videos.slice(0, limitCount)
      }
    }

    console.log(`✅ Successfully processed ${videos.length} videos`)
    setCachedData(cacheKey, videos)
    return { success: true, data: videos }
  } catch (error) {
    console.error("❌ Error getting AI basics videos:", error)
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

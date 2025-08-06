import { NextResponse } from "next/server"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET() {
  try {
    const debug = {
      timestamp: new Date().toISOString(),
      database_connection: !!db,
      collections: {},
      errors: [],
    }

    // Test training_modules collection first
    try {
      console.log("🔍 Debug API: Testing training_modules...")

      // Test 1: Raw collection
      const rawSnapshot = await getDocs(collection(db, "training_modules"))
      debug.collections.training_modules = {
        total_documents: rawSnapshot.size,
        sample_documents: [],
      }

      // Get sample documents
      rawSnapshot.docs.slice(0, 5).forEach((doc) => {
        const data = doc.data()
        debug.collections.training_modules.sample_documents.push({
          id: doc.id,
          title: data.title,
          is_active: data.is_active,
          order_index: data.order_index,
          duration_minutes: data.duration_minutes,
          has_video_url: !!data.video_url,
          has_ppt_url: !!data.ppt_url,
        })
      })

      // Test 2: Active modules
      try {
        const activeQuery = query(collection(db, "training_modules"), where("is_active", "==", true))
        const activeSnapshot = await getDocs(activeQuery)
        debug.collections.training_modules.active_documents = activeSnapshot.size
      } catch (activeError) {
        debug.errors.push({
          test: "active_modules_query",
          error: activeError.message,
        })
      }

      // Test 3: Ordered query
      try {
        const orderedQuery = query(
          collection(db, "training_modules"),
          where("is_active", "==", true),
          orderBy("order_index"),
        )
        const orderedSnapshot = await getDocs(orderedQuery)
        debug.collections.training_modules.ordered_documents = orderedSnapshot.size
      } catch (orderError) {
        debug.errors.push({
          test: "ordered_modules_query",
          error: orderError.message,
          note: "This might indicate a missing Firestore index",
        })
      }
    } catch (modulesError) {
      debug.errors.push({
        test: "training_modules_collection",
        error: modulesError.message,
      })
    }

    // Test ai_basics_videos collection
    try {
      console.log("🔍 Debug API: Testing ai_basics_videos...")

      // Test 1: Raw collection
      const rawSnapshot = await getDocs(collection(db, "ai_basics_videos"))
      debug.collections.ai_basics_videos = {
        total_documents: rawSnapshot.size,
        sample_documents: [],
      }

      // Get sample documents
      rawSnapshot.docs.slice(0, 3).forEach((doc) => {
        const data = doc.data()
        debug.collections.ai_basics_videos.sample_documents.push({
          id: doc.id,
          title: data.title,
          is_active: data.is_active,
          order_index: data.order_index,
          has_video_url: !!data.video_url,
        })
      })

      // Test 2: Active videos
      try {
        const activeQuery = query(collection(db, "ai_basics_videos"), where("is_active", "==", true))
        const activeSnapshot = await getDocs(activeQuery)
        debug.collections.ai_basics_videos.active_documents = activeSnapshot.size
      } catch (activeError) {
        debug.errors.push({
          test: "active_videos_query",
          error: activeError.message,
        })
      }

      // Test 3: Ordered query
      try {
        const orderedQuery = query(
          collection(db, "ai_basics_videos"),
          where("is_active", "==", true),
          orderBy("order_index"),
        )
        const orderedSnapshot = await getDocs(orderedQuery)
        debug.collections.ai_basics_videos.ordered_documents = orderedSnapshot.size
      } catch (orderError) {
        debug.errors.push({
          test: "ordered_videos_query",
          error: orderError.message,
          note: "This might indicate a missing Firestore index",
        })
      }
    } catch (videosError) {
      debug.errors.push({
        test: "ai_basics_videos_collection",
        error: videosError.message,
      })
    }

    console.log("✅ Debug API: Completed")
    return NextResponse.json(debug)
  } catch (error) {
    console.error("❌ Debug API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

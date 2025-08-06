import { type NextRequest, NextResponse } from "next/server"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 API: Fetching training modules...")
    console.log("🔗 Database connection:", !!db)

    // Test basic collection access first
    console.log("🧪 Testing basic collection access...")
    const basicSnapshot = await getDocs(collection(db, "training_modules"))
    console.log(`📊 Basic query found ${basicSnapshot.size} total modules`)

    if (basicSnapshot.size === 0) {
      console.log("❌ No modules found in collection")
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: "No modules found. Please run the seed script.",
      })
    }

    // Log sample documents for debugging
    basicSnapshot.docs.slice(0, 3).forEach((doc, index) => {
      const data = doc.data()
      console.log(`📄 Sample module ${index + 1}:`, {
        id: doc.id,
        title: data.title,
        is_active: data.is_active,
        order_index: data.order_index,
      })
    })

    let modules = []

    // Try with filters and ordering
    try {
      console.log("🧪 Testing filtered and ordered query...")
      const q = query(collection(db, "training_modules"), where("is_active", "==", true), orderBy("order_index"))
      const querySnapshot = await getDocs(q)
      console.log(`📊 Filtered query returned ${querySnapshot.size} modules`)

      modules = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to ISO strings
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
      }))
    } catch (orderError) {
      console.warn("⚠️ Ordered query failed, falling back to manual sorting:", orderError.message)
      
      // Fallback: get active modules without ordering
      try {
        const activeQuery = query(collection(db, "training_modules"), where("is_active", "==", true))
        const activeSnapshot = await getDocs(activeQuery)
        console.log(`📊 Active-only query returned ${activeSnapshot.size} modules`)

        modules = activeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
          updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
        }))

        // Sort manually by order_index
        modules.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      } catch (activeError) {
        console.error("❌ Active query also failed:", activeError.message)
        
        // Final fallback: get all modules and filter/sort manually
        modules = basicSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
            updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
          }))
          .filter((module) => module.is_active !== false) // Include modules where is_active is true or undefined
          .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      }
    }

    console.log(`✅ API: Returning ${modules.length} modules`)
    
    // Log first few modules for verification
    modules.slice(0, 3).forEach((module, index) => {
      console.log(`📚 Module ${index + 1}: ${module.title} (Order: ${module.order_index})`)
    })

    return NextResponse.json({
      success: true,
      data: modules,
      count: modules.length,
      total_duration: modules.reduce((total, module) => total + (module.duration_minutes || 0), 0),
    })
  } catch (error) {
    console.error("❌ API Error fetching modules:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: {
          name: error.name,
          code: error.code,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
      },
      { status: 500 },
    )
  }
}

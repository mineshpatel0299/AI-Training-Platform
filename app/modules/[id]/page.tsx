import { type NextRequest, NextResponse } from "next/server"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 API: Fetching training modules...")

    const q = query(collection(db, "training_modules"), where("is_active", "==", true), orderBy("order_index"))

    const querySnapshot = await getDocs(q)
    console.log(`📊 API: Query returned ${querySnapshot.size} modules`)

    const modules = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to ISO strings
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
      updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
    }))

    console.log(`✅ API: Returning ${modules.length} modules`)

    return NextResponse.json({
      success: true,
      data: modules,
      count: modules.length,
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
        },
      },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId
    console.log("🔍 API: Fetching user progress for:", userId)

    const q = query(collection(db, "user_progress"), where("user_id", "==", userId))
    const querySnapshot = await getDocs(q)
    console.log(`📊 API: Query returned ${querySnapshot.size} progress records`)

    const progress = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to ISO strings
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
      updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
      completed_at: doc.data().completed_at?.toDate?.()?.toISOString() || doc.data().completed_at,
    }))

    console.log(`✅ API: Returning ${progress.length} progress records`)

    return NextResponse.json({
      success: true,
      data: progress,
      count: progress.length,
    })
  } catch (error) {
    console.error("❌ API Error fetching progress:", error)
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

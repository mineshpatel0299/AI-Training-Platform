import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBrSDt7iBbjlM1rFOwWptJVdczSpKV2IDc",
  authDomain: "ai-compliance-a1386.firebaseapp.com",
  projectId: "ai-compliance-a1386",
  storageBucket: "ai-compliance-a1386.firebasestorage.app",
  messagingSenderId: "596978797207",
  appId: "1:596978797207:web:3cff4811e3611432f577d2",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function debugFirestoreDetailed() {
  try {
    console.log("🔍 Detailed Firestore Debug...")
    console.log("🔗 Project ID:", firebaseConfig.projectId)

    // Test 1: Check raw collection access
    console.log("\n📊 Test 1: Raw collection access...")
    try {
      const rawSnapshot = await getDocs(collection(db, "ai_basics_videos"))
      console.log(`✅ Raw collection size: ${rawSnapshot.size}`)

      if (rawSnapshot.size > 0) {
        rawSnapshot.docs.forEach((doc, index) => {
          const data = doc.data()
          console.log(`${index + 1}. Document ID: ${doc.id}`)
          console.log(`   Title: ${data.title}`)
          console.log(`   is_active: ${data.is_active} (type: ${typeof data.is_active})`)
          console.log(`   order_index: ${data.order_index} (type: ${typeof data.order_index})`)
          console.log(`   video_url: ${data.video_url}`)
          console.log(`   Raw data:`, JSON.stringify(data, null, 2))
          console.log("---")
        })
      } else {
        console.log("❌ No documents found in ai_basics_videos collection")
      }
    } catch (error) {
      console.error("❌ Raw collection access failed:", error)
    }

    // Test 2: Check with is_active filter
    console.log("\n📊 Test 2: With is_active filter...")
    try {
      const activeQuery = query(collection(db, "ai_basics_videos"), where("is_active", "==", true))
      const activeSnapshot = await getDocs(activeQuery)
      console.log(`✅ Active videos count: ${activeSnapshot.size}`)

      activeSnapshot.docs.forEach((doc, index) => {
        const data = doc.data()
        console.log(`${index + 1}. ${data.title} - Active: ${data.is_active}`)
      })
    } catch (error) {
      console.error("❌ Active filter failed:", error)
    }

    // Test 3: Check with order_index ordering
    console.log("\n📊 Test 3: With order_index ordering...")
    try {
      const orderedQuery = query(
        collection(db, "ai_basics_videos"),
        where("is_active", "==", true),
        orderBy("order_index"),
      )
      const orderedSnapshot = await getDocs(orderedQuery)
      console.log(`✅ Ordered videos count: ${orderedSnapshot.size}`)

      orderedSnapshot.docs.forEach((doc, index) => {
        const data = doc.data()
        console.log(`${index + 1}. Order ${data.order_index}: ${data.title}`)
      })
    } catch (error) {
      console.error("❌ Ordered query failed:", error)
      console.error("Error details:", error.message)
    }

    // Test 4: Check training modules for comparison
    console.log("\n📊 Test 4: Training modules for comparison...")
    try {
      const modulesSnapshot = await getDocs(collection(db, "training_modules"))
      console.log(`✅ Training modules count: ${modulesSnapshot.size}`)
    } catch (error) {
      console.error("❌ Training modules access failed:", error)
    }

    console.log("\n✅ Debug completed!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Debug error:", error)
    process.exit(1)
  }
}

debugFirestoreDetailed()

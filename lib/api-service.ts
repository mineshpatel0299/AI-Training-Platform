// Client-side API service using fetch instead of direct Firestore
export class ApiService {
  private static baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : ""

  static async getAIBasicsVideos(limit?: number) {
    try {
      const params = new URLSearchParams()
      if (limit) params.append("limit", limit.toString())

      const response = await fetch(`${this.baseUrl}/api/videos?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch videos")
      }

      return data
    } catch (error) {
      console.error("API Error fetching videos:", error)
      return { success: false, error: error.message }
    }
  }

  static async getTrainingModules() {
    try {
      const response = await fetch(`${this.baseUrl}/api/modules`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch modules")
      }

      return data
    } catch (error) {
      console.error("API Error fetching modules:", error)
      return { success: false, error: error.message }
    }
  }

  static async getUserProgress(userId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/api/progress/${userId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch progress")
      }

      return data
    } catch (error) {
      console.error("API Error fetching progress:", error)
      return { success: false, error: error.message }
    }
  }

  static async debugFirestore() {
    try {
      const response = await fetch(`${this.baseUrl}/api/debug/firestore`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Debug failed")
      }

      return data
    } catch (error) {
      console.error("API Error debugging Firestore:", error)
      return { success: false, error: error.message }
    }
  }
}

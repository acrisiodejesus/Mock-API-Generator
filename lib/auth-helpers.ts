import type { NextRequest } from "next/server"
import { adminAuth } from "./firebase-admin"

export async function getUserFromRequest(request: NextRequest): Promise<string | null> {
  try {
    console.log("getUserFromRequest: Starting authentication check")

    // Try to get token from cookie first
    const sessionCookie = request.cookies.get("session")?.value
    console.log("getUserFromRequest: Session cookie exists:", !!sessionCookie)

    if (!sessionCookie) {
      console.log("getUserFromRequest: No session cookie, checking Authorization header")
      // Fallback to Authorization header for API compatibility
      const authHeader = request.headers.get("authorization")
      console.log("getUserFromRequest: Authorization header exists:", !!authHeader)

      if (!authHeader?.startsWith("Bearer ")) {
        console.log("getUserFromRequest: No valid auth method found")
        return null
      }
      const token = authHeader.substring(7)

      if (!adminAuth) {
        console.error("getUserFromRequest: adminAuth is null")
        throw new Error("Firebase Admin not initialized")
      }

      console.log("getUserFromRequest: Verifying ID token")
      const decodedToken = await adminAuth.verifyIdToken(token)
      console.log("getUserFromRequest: Token verified, uid:", decodedToken.uid)
      return decodedToken.uid
    }

    if (!adminAuth) {
      console.error("getUserFromRequest: adminAuth is null")
      throw new Error("Firebase Admin not initialized")
    }

    console.log("getUserFromRequest: Verifying session cookie")
    const decodedToken = await adminAuth.verifyIdToken(sessionCookie)

    console.log("[getUserFromRequest: Session cookie verified, uid:", decodedToken.uid)
    return decodedToken.uid
  } catch (error) {
    console.error("[v0] getUserFromRequest: Error verifying token:", error)
    return null
  }
}

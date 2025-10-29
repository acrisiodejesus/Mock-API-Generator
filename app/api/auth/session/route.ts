import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value

    if (!session || !adminAuth) {
      return NextResponse.json({ user: null })
    }


    const decodedToken = await adminAuth.verifyIdToken(session)

    return NextResponse.json({
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      },
    })
  } catch (error) {
    console.error("Session verification error:", error)
    return NextResponse.json({ user: null })
  }
}

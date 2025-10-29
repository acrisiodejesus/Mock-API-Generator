import { type NextRequest, NextResponse } from "next/server"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { initializeApp, getApps } from "firebase/app"
import { adminDb } from "@/lib/firebase-admin"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    const auth = getAuth(app)

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const idToken = await userCredential.user.getIdToken()

    if (adminDb) {
      await adminDb.collection("userPlans").doc(userCredential.user.uid).set({
        plan: "free",
        createdAt: new Date().toISOString(),
      })
    }

    const response = NextResponse.json({
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      },
    })


    response.cookies.set("session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, 
    })

    return response
  } catch (error: any) {
    console.error("Sign up error:", error)
    return NextResponse.json({ error: error.message || "Failed to sign up" }, { status: 400 })
  }
}

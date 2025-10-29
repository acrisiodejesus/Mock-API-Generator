import { type NextRequest, NextResponse } from "next/server"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"
import { initializeApp, getApps } from "firebase/app"

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
    console.log("Sign in API: Request received")
    const { email, password } = await request.json()

    if (!email || !password) {
      console.error("Sign in API: Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("Sign in API: Attempting to sign in user:", email)
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    const auth = getAuth(app)

   
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("Sign in API: User signed in successfully:", userCredential.user.uid)

    const idToken = await userCredential.user.getIdToken()

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

    console.log("Sign in API: Session cookie set, returning response")
    return response
  } catch (error: any) {
    console.error("Sign in API error:", error)
    return NextResponse.json({ error: error.message || "Failed to sign in" }, { status: 401 })
  }
}

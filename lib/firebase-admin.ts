import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

console.log("[v0] Firebase Admin: Starting initialization")
console.log("[v0] Firebase Admin: FIREBASE_PROJECT_ID exists:", !!process.env.FIREBASE_PROJECT_ID)
console.log("[v0] Firebase Admin: FIREBASE_CLIENT_EMAIL exists:", !!process.env.FIREBASE_CLIENT_EMAIL)
console.log("[v0] Firebase Admin: FIREBASE_PRIVATE_KEY exists:", !!process.env.FIREBASE_PRIVATE_KEY)

let adminApp: App | null = null
let adminAuth: Auth | null = null
let adminDb: Firestore | null = null

const isAdminConfigValid = () => {
  return process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
}

if (isAdminConfigValid()) {
  try {
    console.log("[v0] Firebase Admin: Config is valid, initializing...")
    if (getApps().length === 0) {
      console.log("[v0] Firebase Admin: No existing apps, creating new one")
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })
      console.log("[v0] Firebase Admin: App initialized successfully")
    } else {
      console.log("[v0] Firebase Admin: Using existing app")
      adminApp = getApps()[0]
    }
    adminAuth = getAuth(adminApp)
    adminDb = getFirestore(adminApp)
    console.log("[v0] Firebase Admin: Auth and Firestore initialized successfully")
  } catch (error) {
    console.error("[v0] Firebase Admin initialization error:", error)
  }
} else {
  console.warn("[v0] Firebase Admin configuration is incomplete.")
}

export { adminApp, adminAuth, adminDb, isAdminConfigValid }

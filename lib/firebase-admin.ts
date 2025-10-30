import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

console.log("Firebase Admin: Starting initialization")
console.log("Firebase Admin: FIREBASE_PROJECT_ID exists:", !!process.env.FIREBASE_PROJECT_ID)
console.log("Firebase Admin: FIREBASE_CLIENT_EMAIL exists:", !!process.env.FIREBASE_CLIENT_EMAIL)
console.log("Firebase Admin: FIREBASE_PRIVATE_KEY exists:", !!process.env.FIREBASE_PRIVATE_KEY)

let adminApp: App | null = null
let adminAuth: Auth | null = null
let adminDb: Firestore | null = null

const isAdminConfigValid = () => {
  return process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
}

if (isAdminConfigValid()) {
  try {
    console.log("Firebase Admin: Config is valid, initializing...")
    if (getApps().length === 0) {
      console.log("Firebase Admin: No existing apps, creating new one")
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })
      console.log("Firebase Admin: App initialized successfully")
    } else {
      console.log("Firebase Admin: Using existing app")
      adminApp = getApps()[0]
    }
    adminAuth = getAuth(adminApp)
    adminDb = getFirestore(adminApp)
    console.log("Firebase Admin: Auth and Firestore initialized successfully")
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
  }
} else {
  console.warn("Firebase Admin configuration is incomplete.")
}

export { adminApp, adminAuth, adminDb, isAdminConfigValid }

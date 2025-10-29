import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { getUserFromRequest } from "@/lib/auth-helpers"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { id } = await params

    const apiDoc = await adminDb.collection("apis").doc(id).get()

    if (!apiDoc.exists) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    const apiData = apiDoc.data()
    if (apiData?.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await adminDb.collection("apis").doc(id).delete()

    return NextResponse.json({ message: "API deleted successfully" })
  } catch (error) {
    console.error("Error deleting API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

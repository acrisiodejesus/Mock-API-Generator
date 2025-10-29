import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { generateFakeData } from "@/lib/fake-data-generator"

export async function GET(request: NextRequest, { params }: { params: { endpointId: string } }) {
  try {
    const { endpointId } = params

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const apisSnapshot = await adminDb.collection("apis").where("endpointId", "==", endpointId).limit(1).get()

    if (apisSnapshot.empty) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    const apiDoc = apisSnapshot.docs[0]
    const apiData = apiDoc.data()

    const searchParams = request.nextUrl.searchParams
    const count = Math.min(Number.parseInt(searchParams.get("count") || "10"), 100)
    const page = Math.max(Number.parseInt(searchParams.get("page") || "1"), 1)

    const data = Array.from({ length: count }, (_, index) => {
      const item: Record<string, any> = {
        id: (page - 1) * count + index + 1,
      }

      apiData.fields.forEach((field: { name: string; type: string }) => {
        item[field.name] = generateFakeData(field.type)
      })

      return item
    })

    return NextResponse.json({
      data,
      meta: {
        page,
        count,
        total: count * 10,
      },
    })
  } catch (error) {
    console.error("Error generating fake data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { endpointId: string } }) {
  try {
    const { endpointId } = params
    const body = await request.json()

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const apisSnapshot = await adminDb.collection("apis").where("endpointId", "==", endpointId).limit(1).get()

    if (apisSnapshot.empty) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        id: Math.floor(Math.random() * 10000),
        ...body,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { endpointId: string } }) {
  try {
    const { endpointId } = params
    const body = await request.json()

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const apisSnapshot = await adminDb.collection("apis").where("endpointId", "==", endpointId).limit(1).get()

    if (apisSnapshot.empty) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...body,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { endpointId: string } }) {
  try {
    const { endpointId } = params

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const apisSnapshot = await adminDb.collection("apis").where("endpointId", "==", endpointId).limit(1).get()

    if (apisSnapshot.empty) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Resource deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

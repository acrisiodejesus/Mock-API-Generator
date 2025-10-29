import { type NextRequest, NextResponse } from "next/server"

console.log("Plan API route: Module loaded - SIMPLIFIED VERSION")

export async function GET(request: NextRequest) {
  console.log("Plan API: GET request received - SIMPLIFIED")

  try {
    console.log("Plan API: Returning mock data")
    return NextResponse.json({
      plan: "free",
      message: "Mock data - Temporarily disabled for testing",
    })
  } catch (error) {
    console.error("Plan API: Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("Plan API: POST request received - SIMPLIFIED")

  try {
    const { plan } = await request.json()
    console.log("Plan API: Mock update to plan:", plan)

    return NextResponse.json({
      plan,
      message: "Mock update - Temporarily disabled for testing",
    })
  } catch (error) {
    console.error("Plan API: Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

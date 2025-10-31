import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { generateFakeData } from "@/lib/fake-data-generator";

export async function GET(request: Request, { params }: { params: { username: string, apiname: string } }) {
  try {
    const { username, apiname } = params;

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const apisSnapshot = await adminDb
      .collection("apis")
      .where("userId", "==", username) 
      .where("name", "==", apiname)
      .limit(1)
      .get();

    if (apisSnapshot.empty) {
      return NextResponse.json({ error: "API not found" }, { status: 404 });
    }

    const apiData = apisSnapshot.docs[0].data();

    const url = new URL(request.url);
    const count = Math.min(Number(url.searchParams.get("count") || "10"), 100);
    const page = Math.max(Number(url.searchParams.get("page") || "1"), 1);

    const data = Array.from({ length: count }, (_, index) => {
      const item: Record<string, any> = { id: (page - 1) * count + index + 1 };

      apiData.fields.forEach((field: { name: string; type: string }) => {
        if (field.name && field.type) {
          item[field.name] = generateFakeData(field.type);
        }
      });

      return item;
    });

    return NextResponse.json({
      data,
      meta: { page, count, total: count * 10 },
    });
  } catch (error) {
    console.error("Error generating fake data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function POST() { return NextResponse.json({ error: "Método não permitido" }, { status: 405 }) }
export async function PUT() { return NextResponse.json({ error: "Método não permitido" }, { status: 405 }) }
export async function DELETE() { return NextResponse.json({ error: "Método não permitido" }, { status: 405 }) }

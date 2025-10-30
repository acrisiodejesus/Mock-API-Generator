import { type NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { generateFakeData } from "@/lib/fake-data-generator";


export async function GET(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get("name");
    if (!name) return NextResponse.json({ error: "name é obrigatório" }, { status: 400 });

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const apisSnapshot = await adminDb
      .collection("apis")
      .where("name", "==", name)
      .limit(1)
      .get();

    if (apisSnapshot.empty) {
      return NextResponse.json({ error: "API não encontrada" }, { status: 404 });
    }

    const apiData = apisSnapshot.docs[0].data();

    const count = Math.min(Number(request.nextUrl.searchParams.get("count") || "10"), 100);
    const page = Math.max(Number(request.nextUrl.searchParams.get("page") || "1"), 1);

    const data = Array.from({ length: count }, (_, index) => {
      const item: Record<string, any> = {
        id: (page - 1) * count + index + 1,
      };

      apiData.fields.forEach((field: { name: string; type: string }) => {
        item[field.name] = generateFakeData(field.type);
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


export async function POST(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get("name");
    if (!name) return NextResponse.json({ error: "name é obrigatório" }, { status: 400 });

    const body = await request.json();

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const apisSnapshot = await adminDb
      .collection("apis")
      .where("name", "==", name)
      .limit(1)
      .get();

    if (apisSnapshot.empty) {
      return NextResponse.json({ error: "API não encontrada" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: Math.floor(Math.random() * 10000),
        ...body,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}


export async function PUT(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get("name");
    if (!name) return NextResponse.json({ error: "name é obrigatório" }, { status: 400 });

    const body = await request.json();

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const apisSnapshot = await adminDb
      .collection("apis")
      .where("name", "==", name)
      .limit(1)
      .get();

    if (apisSnapshot.empty) {
      return NextResponse.json({ error: "API não encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      ...body,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in PUT:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get("name");
    if (!name) return NextResponse.json({ error: "name é obrigatório" }, { status: 400 });

    if (!adminDb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const apisSnapshot = await adminDb
      .collection("apis")
      .where("name", "==", name)
      .limit(1)
      .get();

    if (apisSnapshot.empty) {
      return NextResponse.json({ error: "API não encontrada" }, { status: 404 });
    }


    await apisSnapshot.docs[0].ref.delete();

    return NextResponse.json({ message: "Recurso deletado com sucesso" });
  } catch (error) {
    console.error("Error in DELETE:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

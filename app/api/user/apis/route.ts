import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
  }

  try {
    const snapshot = await adminDb.collection("apis").where("userId", "==", userId).get();

    const apisData = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });

    return NextResponse.json(apisData);
  } catch (error) {
    console.error("Erro ao buscar APIs:", error);
    return NextResponse.json({ error: "Erro ao buscar APIs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host");
  const origin = `${protocol}://${host}`;

  try {
    const body = await request.json();

    if (!body.userId || !body.name) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const endpointId = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const endpoint = `${origin}/api/${endpointId}`;

    // Buscar usuário
    const userDoc = await adminDb.collection("users").where("uid", "==", body.userId).get();
    let userPlan = "free";
    if (!userDoc.empty) {
      const userData = userDoc.docs[0].data();
      userPlan = userData.plan || "free";
    }

    // Contar APIs existentes
    const apisSnapshot = await adminDb.collection("apis").where("userId", "==", body.userId).get();
    if (userPlan === "free" && apisSnapshot.size >= 2) {
      return NextResponse.json({ error: "Limite de APIs gratuitas atingido. Faça upgrade para Pro." }, { status: 403 });
    }

    const docRef = await adminDb.collection("apis").add({
      userId: body.userId,
      name: body.name,
      description: body.description || "",
      endpoint,
      fields: body.fields || [],
      createdAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar API:", error);
    return NextResponse.json({ error: "Erro ao criar API" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiId = searchParams.get("apiId");

  if (!apiId) {
    return NextResponse.json({ error: "apiId é obrigatório" }, { status: 400 });
  }

  try {
    const body = await request.json();
    await adminDb.collection("apis").doc(apiId).update({
      ...body,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar API:", error);
    return NextResponse.json({ error: "Erro ao atualizar API" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiId = searchParams.get("apiId");

  if (!apiId) {
    return NextResponse.json({ error: "apiId é obrigatório" }, { status: 400 });
  }

  try {
    await adminDb.collection("apis").doc(apiId).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar API:", error);
    return NextResponse.json({ error: "Erro ao deletar API" }, { status: 500 });
  }
}

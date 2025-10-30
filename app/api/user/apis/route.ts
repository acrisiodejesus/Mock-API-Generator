import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin"; 
import { Timestamp } from "firebase-admin/firestore";

export const runtime = "nodejs";

function validateFields(fields: any[]): boolean {
  if (!Array.isArray(fields)) return false;
  return fields.every(f => typeof f.name === "string" && typeof f.type === "string");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });

  try {
    const apisRef = adminDb.collection("apis");
    const snapshot = await apisRef.where("userId", "==", userId).get();

    const apisData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
    }));

    return NextResponse.json(apisData);
  } catch (error) {
    console.error("Erro ao buscar APIs:", error);
    return NextResponse.json({ error: "Erro ao buscar APIs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.userId || !body.name) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    if (!validateFields(body.fields || [])) {
      return NextResponse.json({ error: "Campos inválidos em 'fields'" }, { status: 400 });
    }

    const origin = `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("host")}`;
    const endpointId = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
   const username = body.username || body.displayName || body.email.split("@")[0];
const endpoint = `${origin}/api/${username}/${endpointId}`;

    const usersRef = adminDb.collection("users");
    const userSnapshot = await usersRef.where("uid", "==", body.userId).get();
    let userPlan = "free";
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      userPlan = userData.plan || "free";
    }

    const apisRef = adminDb.collection("apis");
    const existingApi = await apisRef
      .where("userId", "==", body.userId)
      .where("endpoint", "==", endpoint)
      .get();

    if (!existingApi.empty) {
      return NextResponse.json({ error: "Você já possui uma API com esse nome" }, { status: 409 });
    }

    const apisSnapshot = await apisRef.where("userId", "==", body.userId).get();
    if (userPlan === "free" && apisSnapshot.size >= 2) {
      return NextResponse.json({ error: "Limite de APIs gratuitas atingido. Faça upgrade para Pro." }, { status: 403 });
    }

  
    const docRef = await apisRef.add({
      userId: body.userId,
      name: body.name,
      description: body.description || "",
      endpoint,
      fields: body.fields || [],
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ id: docRef.id, endpoint }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar API:", error);
    return NextResponse.json({ error: "Erro ao criar API" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiId = searchParams.get("apiId");
  if (!apiId) return NextResponse.json({ error: "apiId é obrigatório" }, { status: 400 });

  try {
    const body = await request.json();

    if (body.fields && !validateFields(body.fields)) {
      return NextResponse.json({ error: "Campos inválidos em 'fields'" }, { status: 400 });
    }

    await adminDb.collection("apis").doc(apiId).update({
      ...body,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar API:", error);
    return NextResponse.json({ error: "Erro ao atualizar API" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { apiId: string } }) {
  const { apiId } = params;
  if (!apiId) return NextResponse.json({ error: "apiId é obrigatório" }, { status: 400 });

  try {
    await adminDb.collection("apis").doc(apiId).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar API:", error);
    return NextResponse.json({ error: "Erro ao deletar API" }, { status: 500 });
  }
}
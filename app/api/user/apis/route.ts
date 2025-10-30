import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin"; // seu arquivo de inicialização Admin
import { collection, doc, getDocs, query, where, addDoc, updateDoc, deleteDoc, DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";

// Define o runtime para Node.js padrão (Serverless), não Edge
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });

  try {
    const q = query(collection(adminDb, "apis"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const apisData = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
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

    // Gera endpoint
    const endpointId = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const origin = `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("host")}`;
    const endpoint = `${origin}/api/${endpointId}`;

    // Busca plano do usuário
    const userSnapshot = await getDocs(query(collection(adminDb, "users"), where("uid", "==", body.userId)));
    let userPlan = "free";
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      userPlan = userData.plan || "free";
    }

    // Conta APIs existentes
    const apisSnapshot = await getDocs(query(collection(adminDb, "apis"), where("userId", "==", body.userId)));
    if (userPlan === "free" && apisSnapshot.size >= 2) {
      return NextResponse.json({ error: "Limite de APIs gratuitas atingido. Faça upgrade para Pro." }, { status: 403 });
    }

    const docRef = await addDoc(collection(adminDb, "apis"), {
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
  if (!apiId) return NextResponse.json({ error: "apiId é obrigatório" }, { status: 400 });

  try {
    const body = await request.json();
    await updateDoc(doc(adminDb, "apis", apiId), {
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
  if (!apiId) return NextResponse.json({ error: "apiId é obrigatório" }, { status: 400 });

  try {
    await deleteDoc(doc(adminDb, "apis", apiId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar API:", error);
    return NextResponse.json({ error: "Erro ao deletar API" }, { status: 500 });
  }
}

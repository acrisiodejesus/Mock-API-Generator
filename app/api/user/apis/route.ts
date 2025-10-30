import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
  }
  try {
    const q = query(collection(db, "apis"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const apisData = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
    return NextResponse.json(apisData);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar APIs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // if (!body.userId || !body.name || !body.endpoint) {
    //   return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    // }

    const endpointId = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const protocol = body.headers["x-forwarded-proto"] || "http";
    const host = body.headers.host;
    const origin = `${protocol}://${host}`;
    const endpoint = `${origin}/api/${endpointId}`;  
    const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", body.userId)));
    console.log(userDoc, endpoint)
    let userPlan: string = "free";
    if (!userDoc.empty) {
      const userData = userDoc.docs[0].data();
      userPlan = userData.plan || "free";
    }
    const apisSnapshot = await getDocs(query(collection(db, "apis"), where("userId", "==", body.userId)));
    const apiCount = apisSnapshot.size;
    if (userPlan === "free" && apiCount >= 2) {
      return NextResponse.json({ error: "Limite de APIs gratuitas atingido. Faça upgrade para Pro." }, { status: 403 });
    }
    const docRef = await addDoc(collection(db, "apis"), {
      userId: body.userId,
      name: body.name,
      description: body.description || "",
      endpoint: endpoint,
      fields: body.fields || [],
      createdAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar API" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiId = searchParams.get("apiId");
  try {
    const body = await request.json();
    if (!apiId) {
      return NextResponse.json({ error: "apiId é obrigatório" }, { status: 400 });
    }
    await updateDoc(doc(db, "apis", apiId), {
      ...body,
      updatedAt: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar API" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const apiId = searchParams.get("apiId");
  if (!userId || !apiId) {
    return NextResponse.json({ error: "userId e apiId são obrigatórios" }, { status: 400 });
  }
  try {
    await deleteDoc(doc(db, "apis", apiId));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar API" }, { status: 500 });
  }
}

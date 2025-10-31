import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { generateFakeData } from "@/lib/fake-data-generator";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string; apiname: string }> }
) {
  try {
    const { uid, apiname } = await params;
    if (!uid || !apiname) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
    }
    const origin = `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("host")}`;
const endpoint = `${origin}/api/${uid}/${apiname}`;
const apisSnapshot = await adminDb
  .collection("apis")
  .where("endpoint", "==", endpoint)
  .limit(1)
  .get();

    
    if (apisSnapshot.empty) {
      return NextResponse.json({ error: "API não encontrada" }, { status: 404 });
    }

    const apiData = apisSnapshot.docs[0].data();

    // Gerar dados fake
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

    return NextResponse.json({ data, meta: { page, count, total: count * 10 } });

  } catch (error) {
    console.error("Erro ao buscar API:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
// Bloquear outros métodos
export async function POST() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}

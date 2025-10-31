import { type NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Webhook Riha recebido:", body);
    if (body.status === "paid" && body.userId) {
      const uid = body.userId; 
      await adminDb.collection("users").doc(uid).update({
        plan: "pro",
        planUpdatedAt: new Date().toISOString(),
      });

      console.log(`Plano do usuário ${uid} atualizado para PRO`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

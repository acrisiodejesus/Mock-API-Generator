import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
  const origin = `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("host")}`;

    const paymentData = {
      amount: 50.0, 
      currency: "MT",
      description: "Plano Pro",
      redirect_url: `${origin}/successpro`, 
      webhook_url: `${origin}/api/riha-webhook`,
    };

    const response = await fetch("https://api.riha.co.mz/payment-links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.RIHA_API_KEY || "", 
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({ checkout_url: data.checkout_url });

  } catch (error: any) {
    console.error("Erro ao criar link de pagamento:", error);
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
  }
}

// Bloquear outros métodos
export async function GET() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}

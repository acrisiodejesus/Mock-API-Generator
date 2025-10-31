"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export default function SuccessProPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchPlan = async () => {
      const res = await fetch("/api/user/plan", { credentials: "include" });
      const data = await res.json();
      setPlan(data.plan);
      setLoading(false);
    };

    fetchPlan();
  }, [user]);

  if (loading) return <p>Carregando...</p>;
  if (plan !== "pro") return <p>Erro: pagamento não confirmado.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Header />
      <h1 className="text-4xl font-bold text-green-600 mb-4">Parabéns! 🎉</h1>
      <p className="text-lg mb-8">Você adquiriu o plano PRO com sucesso.</p>
      <Button onClick={() => router.push("/dashboard")}>
        Ir para Dashboard
      </Button>
    </div>
  );
}

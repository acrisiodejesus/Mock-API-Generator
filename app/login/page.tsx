"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FirebaseSetupBanner } from "@/components/firebase-setup-banner";
import { useI18n } from "@/lib/i18n-context";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useI18n();
  const { signIn, configError } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (configError) {
      setError(t("firebase.notConfigured"));
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with email:", email);
      await signIn(email, password);
      console.log("Login successful, redirecting to dashboard");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || t("auth.loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-4">
        <FirebaseSetupBanner />

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t("auth.login")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("auth.loginDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.loggingIn")}
                  </>
                ) : (
                  t("auth.login")
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              {t("auth.noAccount")}{" "}
              <Link href="/register" className="text-primary hover:underline">
                {t("auth.register")}
              </Link>
            </div>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t("auth.backHome")}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

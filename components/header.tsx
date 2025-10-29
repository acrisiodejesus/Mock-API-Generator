"use client"

import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  const { user, signOut } = useAuth()
  const { locale, setLocale, t } = useI18n()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 text-primary font-bold text-xl">🌐</div>
          <span className="text-xl font-bold">{t("app.name")}</span>
        </Link>

        <nav className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-border rounded-md p-1">
            <button
              onClick={() => setLocale("pt")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                locale === "pt" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              PT
            </button>
            <button
              onClick={() => setLocale("en")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                locale === "en" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              EN
            </button>
          </div>

          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">{t("nav.dashboard")}</Button>
              </Link>
              <Button variant="ghost" onClick={() => signOut()}>
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{t("nav.login")}</Button>
              </Link>
              <Link href="/register">
                <Button>{t("nav.register")}</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

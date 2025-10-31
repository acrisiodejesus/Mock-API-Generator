"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Database, Code, Zap, Globe, Check } from "lucide-react";
import { FirebaseSetupBanner } from "@/components/firebase-setup-banner";
import { useI18n } from "@/lib/i18n-context";
import Link from "next/link";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 pt-6">
          <FirebaseSetupBanner />
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
              {t("hero.title")}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
              {t("hero.subtitle")}
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  {t("hero.cta")}
                </Button>
              </Link>
              <a href="#pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 bg-transparent"
                >
                  {t("hero.secondary")}
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                {t("features.step1.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("features.step1.desc")}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">
                {t("features.step2.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("features.step2.desc")}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                {t("features.step3.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("features.step3.desc")}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">
                {t("features.step3.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("features.step3.desc")}
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-center">
              {t("features.title")}
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("features.step1.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("features.step1.desc")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("features.step2.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("features.step2.desc")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("features.step3.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("features.step3.desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">{t("pricing.title")}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Free Plan */}
              <div className="bg-card border border-border rounded-lg p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">
                    {t("pricing.free.title")}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {t("pricing.free.price")}
                    </span>
                    <span className="text-muted-foreground">
                      {t("pricing.free.period")}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{t("pricing.free.apis")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{t("pricing.free.requests")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{t("pricing.free.support")}</span>
                  </li>
                </ul>

                <Link href="/register">
                  <Button variant="outline" className="w-full bg-transparent">
                    {t("pricing.free.cta")}
                  </Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-primary/5 border-2 border-primary rounded-lg p-8 space-y-6 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold">
                    {t("pricing.pro.title")}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {t("pricing.pro.price")}
                    </span>
                    <span className="text-muted-foreground">
                      {t("pricing.pro.period")}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="font-semibold">
                      {t("pricing.pro.apis")}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{t("pricing.pro.requests")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{t("pricing.pro.support")}</span>
                  </li>
                </ul>

                <Link href="/register">
                  <Button className="w-full">{t("pricing.pro.cta")}</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-lg p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">{t("hero.title")}</h2>
            <p className="text-xl text-muted-foreground">
              {t("hero.subtitle")}
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                {t("hero.cta")}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>{t("app.name")}</p>
        </div>
      </footer>
    </div>
  );
}

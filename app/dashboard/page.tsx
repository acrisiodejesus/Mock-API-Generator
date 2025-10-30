"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FirebaseSetupBanner } from "@/components/firebase-setup-banner";
import { useI18n } from "@/lib/i18n-context";
import {
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  AlertCircle,
  Crown,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserPlan {
  plan: "free" | "pro";
  createdAt: string;
}

interface API {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useI18n();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [apis, setApis] = useState<API[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      console.log("Loading dashboard data for user:", user.uid);

      const planRes = await fetch("/api/user/plan", {
        credentials: "include",
      });

      console.log("Plan response status:", planRes.status);

      if (planRes.ok) {
        const planData = await planRes.json();
        console.log("Plan data loaded:", planData);
        setUserPlan(planData);
      } else {
        console.error("Failed to load plan:", await planRes.text());
      }

      // Load user APIs
      const apisRes = await fetch(`/api/user/apis?userId=${user.uid}`, {
        credentials: "include",
      });

      if (apisRes.ok) {
        const apisData = await apisRes.json();
        setApis(apisData || []);
      } else {
        console.error("Failed to load APIs:", await apisRes.text());
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    try {
      console.log("Deleting API:", id);

      const res = await fetch(`/api/user/apis/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      console.log("Delete response status:", res.status);

      if (res.ok) {
        setApis(apis.filter((api) => api.id !== id));
        console.log("API deleted successfully");
      } else {
        console.error("Failed to delete API:", await res.text());
      }
    } catch (error) {
      console.error("Error deleting API:", error);
    }
    setDeleteId(null);
  };

  const copyEndpoint = (endpoint: string) => {
    navigator.clipboard.writeText(`${endpoint}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  const canCreateMore = userPlan?.plan === "pro" || apis.length < 2;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <FirebaseSetupBanner />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("dashboard.subtitle")} - {apis.length}{" "}
              {userPlan?.plan === "free" ? "/ 2" : ""} APIs
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={userPlan?.plan === "pro" ? "default" : "secondary"}
              className="text-sm px-3 py-1"
            >
              {userPlan?.plan === "pro" && <Crown className="h-3 w-3 mr-1" />}
              {userPlan?.plan === "pro" ? "Pro" : "Free"}
            </Badge>
            <Link href="/dashboard/new">
              <Button disabled={!canCreateMore}>
                <Plus className="h-4 w-4 mr-2" />
                {t("dashboard.newApi")}
              </Button>
            </Link>
          </div>
        </div>

        {!canCreateMore && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("dashboard.limitReached")}</AlertTitle>
            <AlertDescription>
              {t("dashboard.limitReachedDesc")}
              <Button variant="link" className="px-2" asChild>
                <a href="#pricing">{t("dashboard.upgradeToPro")}</a>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {apis.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">
                {t("dashboard.noApis")}
              </p>
              <Link href="/dashboard/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("dashboard.createFirst")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apis.map((api) => (
              <Card key={api.id}>
                <CardHeader>
                  <CardTitle>{api.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {api.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                        {api.endpoint}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyEndpoint(api.endpoint)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <a
                      href={api.endpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3 mr-2" />
                      {t("dashboard.test")}
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteId(api.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboard.deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.deleteConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("dashboard.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              {t("dashboard.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

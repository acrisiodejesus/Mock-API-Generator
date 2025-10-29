"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Field {
  name: string;
  type: string;
}

const FIELD_TYPES = [
  { value: "string", label: "Texto (String)" },
  { value: "number", label: "Número (Number)" },
  { value: "boolean", label: "Booleano (Boolean)" },
  { value: "email", label: "Email" },
  { value: "name", label: "Nome" },
  { value: "phone", label: "Telefone" },
  { value: "date", label: "Data" },
  { value: "url", label: "URL" },
  { value: "uuid", label: "UUID" },
  { value: "image", label: "Imagem URL" },
];

export default function NewAPIPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<Field[]>([
    { name: "id", type: "number" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addField = () => {
    setFields([...fields, { name: "", type: "string" }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: keyof Field, value: string) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Creating new API:", { name, description, fields });

      const res = await fetch("/api/user/apis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          description,
          fields,
        }),
      });

      console.log("Create API response status:", res.status);

      if (res.ok) {
        console.log("API created successfully, redirecting to dashboard");
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        console.error("Failed to create API:", errorData);
        setError(errorData.error || t("newApi.error"));
      }
    } catch (err) {
      console.error("Error creating API:", err);
      setError(t("newApi.error"));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t("newApi.title")}</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{t("newApi.title")}</CardTitle>
              <CardDescription>
                Define the structure of your fake API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t("newApi.name")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("newApi.namePlaceholder")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("newApi.description")}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("newApi.descPlaceholder")}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t("newApi.fields")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addField}
                  >
                    {t("newApi.addField")}
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`field-name-${index}`}>
                          {t("newApi.fieldName")}
                        </Label>
                        <Input
                          id={`field-name-${index}`}
                          value={field.name}
                          onChange={(e) =>
                            updateField(index, "name", e.target.value)
                          }
                          placeholder="name"
                          required
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`field-type-${index}`}>
                          {t("newApi.fieldType")}
                        </Label>
                        <Select
                          value={field.type}
                          onValueChange={(value) =>
                            updateField(index, "type", value)
                          }
                        >
                          <SelectTrigger id={`field-type-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeField(index)}
                        >
                          {t("newApi.removeField")}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : t("newApi.submit")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  disabled={loading}
                >
                  {t("newApi.cancel")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}

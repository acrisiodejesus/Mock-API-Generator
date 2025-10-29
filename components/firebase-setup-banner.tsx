"use client"

import { useEffect, useState } from "react"
import { isConfigValid, getMissingVars } from "@/lib/firebase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FirebaseSetupBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [missingVars, setMissingVars] = useState<string[]>([])

  useEffect(() => {
    if (!isConfigValid()) {
      setShowBanner(true)
      setMissingVars(getMissingVars())
    }
  }, [])

  if (!showBanner) return null

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Configuração do Firebase Necessária</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>Para usar o XingLing API, você precisa configurar as variáveis de ambiente do Firebase.</p>
        <div className="mt-2">
          <p className="font-semibold text-sm mb-1">Variáveis faltando:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            {missingVars.map((varName) => (
              <li key={varName} className="font-mono text-xs">
                {varName}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" asChild className="bg-background">
            <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
              Abrir Firebase Console
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowBanner(false)} className="bg-background">
            Fechar
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

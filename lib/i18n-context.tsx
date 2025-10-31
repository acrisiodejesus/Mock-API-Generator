"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Locale = "pt" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  pt: {
    "app.name": "XingLing API",
    "app.tagline": "Crie APIs fake em segundos",
    "app.description":
      "Gere dados fake realistas para seus projetos de desenvolvimento",
    "nav.home": "Início",
    "nav.dashboard": "Dashboard",
    "nav.login": "Entrar",
    "nav.register": "Registrar",
    "nav.logout": "Sair",
    "auth.login": "Entrar",
    "auth.loginDesc": "Entre na sua conta XingLing API",
    "auth.email": "Email",
    "auth.password": "Senha",
    "auth.confirmPassword": "Confirmar Senha",
    "auth.loggingIn": "Entrando...",
    "auth.loginError": "Erro ao fazer login",
    "auth.noAccount": "Não tem uma conta?",
    "auth.register": "Registrar",
    "auth.registerDesc": "Crie sua conta XingLing API",
    "auth.registering": "Criando conta...",
    "auth.registerError": "Erro ao criar conta",
    "auth.hasAccount": "Já tem uma conta?",
    "auth.passwordMismatch": "As senhas não coincidem",
    "auth.passwordTooShort": "A senha deve ter pelo menos 6 caracteres",
    "auth.backHome": "Voltar para o início",
    "hero.title": "Crie APIs Fake em Segundos",
    "hero.subtitle":
      "Gere dados realistas para desenvolvimento e testes sem configuração complexa",
    "hero.cta": "Começar Grátis",
    "hero.secondary": "Ver Documentação",
    "features.title": "Como Funciona",
    "features.step1.title": "Defina a Estrutura",
    "features.step1.desc":
      "Crie campos personalizados com tipos de dados variados",
    "features.step2.title": "Gere Dados",
    "features.step2.desc": "Dados fake realistas são gerados automaticamente",
    "features.step3.title": "Use a API",
    "features.step3.desc": "Acesse via REST API de qualquer aplicação",
    "pricing.title": "Planos Simples",
    "pricing.free.title": "Gratuito",
    "pricing.free.price": "0 Mtn",
    "pricing.free.period": "/mês",
    "pricing.free.apis": "2 APIs",
    "pricing.free.requests": "Requisições ilimitadas",
    "pricing.free.support": "Suporte comunitário",
    "pricing.free.cta": "Começar Grátis",
    "pricing.pro.title": "Pro",
    "pricing.pro.price": "20 Mtn",
    "pricing.pro.period": "/mês",
    "pricing.pro.apis": "APIs ilimitadas",
    "pricing.pro.requests": "Requisições ilimitadas",
    "pricing.pro.support": "Suporte prioritário",
    "pricing.pro.cta": "Fazer Upgrade",
    "login.title": "Entrar",
    "login.subtitle": "Entre na sua conta XingLing API",
    "login.email": "Email",
    "login.password": "Senha",
    "login.submit": "Entrar",
    "login.noAccount": "Não tem uma conta?",
    "login.register": "Registre-se",
    "login.error": "Erro ao fazer login",
    "register.title": "Criar Conta",
    "register.subtitle": "Crie sua conta XingLing API",
    "register.email": "Email",
    "register.password": "Senha",
    "register.submit": "Criar Conta",
    "register.hasAccount": "Já tem uma conta?",
    "register.login": "Entrar",
    "register.error": "Erro ao criar conta",
    "dashboard.title": "Minhas APIs",
    "dashboard.create": "Nova API",
    "dashboard.empty": "Nenhuma API criada ainda",
    "dashboard.emptyDesc": "Crie sua primeira API fake para começar",
    "dashboard.plan": "Plano",
    "dashboard.apis": "APIs",
    "dashboard.limit": "Limite atingido",
    "dashboard.limitDesc": "Você atingiu o limite de 2 APIs no plano gratuito",
    "dashboard.upgrade": "Fazer Upgrade para Pro",
    "dashboard.endpoint": "Endpoint",
    "dashboard.copy": "Copiar",
    "dashboard.test": "Testar",
    "dashboard.delete": "Deletar",
    "dashboard.deleteConfirm": "Tem certeza?",
    "dashboard.deleteDesc": "Esta ação não pode ser desfeita",
    "dashboard.cancel": "Cancelar",
    "newApi.title": "Criar Nova API",
    "newApi.name": "Nome da API",
    "newApi.namePlaceholder": "Ex: users, products, posts",
    "newApi.description": "Descrição",
    "newApi.descPlaceholder": "Descreva o propósito desta API",
    "newApi.fields": "Campos",
    "newApi.fieldName": "Nome do Campo",
    "newApi.fieldType": "Tipo",
    "newApi.addField": "Adicionar Campo",
    "newApi.removeField": "Remover",
    "newApi.submit": "Criar API",
    "newApi.cancel": "Cancelar",
    "newApi.error": "Erro ao criar API",
    "firebase.notConfigured": "Firebase não configurado",
    "firebase.notConfiguredDesc":
      "Configure as variáveis de ambiente do Firebase para usar a aplicação",
    "dashboard.subtitle": "Gerencie suas APIs fake",
    "dashboard.newApi": "Nova API",
    "dashboard.goPro": "Aderir ao Pro por 20MT",
    "dashboard.noApis": "Nenhuma API criada ainda",
    "dashboard.createFirst": "Criar Primeira API",
    "dashboard.limitReached": "Limite Atingido",
    "dashboard.limitReachedDesc":
      "Você atingiu o limite de 2 APIs no plano gratuito.",
    "dashboard.upgradeToPro": "Fazer Upgrade para Pro",
    "dashboard.deleteConfirmDesc":
      "Esta ação não pode ser desfeita. A API será deletada permanentemente.",
  },
  en: {
    "app.name": "XingLing API",
    "app.tagline": "Create fake APIs in seconds",
    "app.description":
      "Generate realistic fake data for your development projects",
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.logout": "Logout",
    "auth.login": "Login",
    "auth.loginDesc": "Sign in to your XingLing API account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.loggingIn": "Signing in...",
    "auth.loginError": "Error signing in",
    "auth.noAccount": "Don't have an account?",
    "auth.register": "Register",
    "auth.registerDesc": "Create your XingLing API account",
    "auth.registering": "Creating account...",
    "auth.registerError": "Error creating account",
    "auth.hasAccount": "Already have an account?",
    "auth.passwordMismatch": "Passwords do not match",
    "auth.passwordTooShort": "Password must be at least 6 characters",
    "auth.backHome": "Back to home",
    "hero.title": "Create Fake APIs in Seconds",
    "hero.subtitle":
      "Generate realistic data for development and testing without complex setup",
    "hero.cta": "Get Started Free",
    "hero.secondary": "View Documentation",
    "features.title": "How It Works",
    "features.step1.title": "Define Structure",
    "features.step1.desc": "Create custom fields with various data types",
    "features.step2.title": "Generate Data",
    "features.step2.desc": "Realistic fake data is generated automatically",
    "features.step3.title": "Use the API",
    "features.step3.desc": "Access via REST API from any application",
    "pricing.title": "Simple Pricing",
    "pricing.free.title": "Free",
    "pricing.free.price": "$0",
    "pricing.free.period": "/month",
    "pricing.free.apis": "2 APIs",
    "pricing.free.requests": "Unlimited requests",
    "pricing.free.support": "Community support",
    "pricing.free.cta": "Get Started Free",
    "pricing.pro.title": "Pro",
    "pricing.pro.price": "$2",
    "pricing.pro.period": "/month",
    "pricing.pro.apis": "Unlimited APIs",
    "pricing.pro.requests": "Unlimited requests",
    "pricing.pro.support": "Priority support",
    "pricing.pro.cta": "Upgrade Now",
    "login.title": "Login",
    "login.subtitle": "Sign in to your XingLing API account",
    "login.email": "Email",
    "login.password": "Password",
    "login.submit": "Sign In",
    "login.noAccount": "Don't have an account?",
    "login.register": "Register",
    "login.error": "Error signing in",
    "register.title": "Create Account",
    "register.subtitle": "Create your XingLing API account",
    "register.email": "Email",
    "register.password": "Password",
    "register.submit": "Create Account",
    "register.hasAccount": "Already have an account?",
    "register.login": "Sign In",
    "register.error": "Error creating account",
    "dashboard.title": "My APIs",
    "dashboard.create": "New API",
    "dashboard.empty": "No APIs created yet",
    "dashboard.emptyDesc": "Create your first fake API to get started",
    "dashboard.plan": "Plan",
    "dashboard.apis": "APIs",
    "dashboard.limit": "Limit reached",
    "dashboard.limitDesc":
      "You have reached the limit of 2 APIs on the free plan",
    "dashboard.upgrade": "Upgrade to Pro",
    "dashboard.endpoint": "Endpoint",
    "dashboard.copy": "Copy",
    "dashboard.test": "Test",
    "dashboard.delete": "Delete",
    "dashboard.deleteConfirm": "Are you sure?",
    "dashboard.deleteDesc": "This action cannot be undone",
    "dashboard.cancel": "Cancel",
    "newApi.title": "Create New API",

    "newApi.name": "API Name",
    "newApi.namePlaceholder": "Ex: users, products, posts",
    "newApi.description": "Description",
    "newApi.descPlaceholder": "Describe the purpose of this API",
    "newApi.fields": "Fields",
    "newApi.fieldName": "Field Name",
    "newApi.fieldType": "Type",
    "newApi.addField": "Add Field",
    "newApi.removeField": "Remove",
    "newApi.submit": "Create API",
    "newApi.cancel": "Cancel",
    "newApi.error": "Error creating API",
    "firebase.notConfigured": "Firebase not configured",
    "firebase.notConfiguredDesc":
      "Configure Firebase environment variables to use the application",
    "dashboard.subtitle": "Manage your fake APIs",
    "dashboard.newApi": "New API",
    "dashboard.noApis": "No APIs created yet",
    "dashboard.goPro": "Go Pro for 20MT",
    "dashboard.createFirst": "Create First API",
    "dashboard.limitReached": "Limit Reached",
    "dashboard.limitReachedDesc":
      "You have reached the limit of 2 APIs on the free plan.",
    "dashboard.upgradeToPro": "Upgrade to Pro",
    "dashboard.deleteConfirmDesc":
      "This action cannot be undone. The API will be permanently deleted.",
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && (savedLocale === "pt" || savedLocale === "en")) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations.pt] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

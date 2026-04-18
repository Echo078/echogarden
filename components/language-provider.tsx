"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Language, translations, t as translateFn } from "@/lib/translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isZh: boolean;
  isEn: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ 
  children, 
  defaultLanguage = "en" 
}: LanguageProviderProps) {
  const [lang, setLangState] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved preference
    const saved = localStorage.getItem("echo-garden-lang") as Language | null;
    if (saved && (saved === "en" || saved === "zh")) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("echo-garden-lang", newLang);
    }
  };

  const toggleLang = () => {
    const newLang = lang === "en" ? "zh" : "en";
    setLang(newLang);
  };

  const t = (key: string) => translateFn(key, lang);

  const value: LanguageContextType = {
    lang,
    setLang,
    toggleLang,
    isZh: lang === "zh",
    isEn: lang === "en",
    t,
  };

  // During SSR and first render, use default language
  // This prevents hydration mismatch
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{
        ...value,
        lang: defaultLanguage,
        isZh: defaultLanguage === "zh",
        isEn: defaultLanguage === "en",
        t: (key: string) => translateFn(key, defaultLanguage),
      }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Export translations object for direct access if needed
export { translations };

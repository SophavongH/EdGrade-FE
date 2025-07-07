"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/i18n/en.json";
import kh from "@/i18n/kh.json";

type Messages = Record<string, string>;
const messages: Record<"en" | "kh", Messages> = { en, kh };

type Lang = "en" | "kh";
type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lang") as Lang) || "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = (key: string) => messages[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
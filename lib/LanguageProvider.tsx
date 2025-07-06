"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/i18n/en.json";
import kh from "@/i18n/kh.json";

type Messages = Record<string, string>;
const messages: Record<"en" | "kh", Messages> = { en, kh };

type Locale = "en" | "kh";
type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lang") as Locale) || "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", locale);
  }, [locale]);

  const t = (key: string) => messages[locale][key] || key;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
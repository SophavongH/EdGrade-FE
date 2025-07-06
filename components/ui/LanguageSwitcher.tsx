"use client";
// Update the import path below to the correct relative path if needed
import { useLanguage } from "../../lib/LanguageProvider";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const LANGUAGES = [
  {
    code: "en",
    label: "English",
    flag: (
      <Image
        src="/icons/united-kingdom.svg"
        alt="English"
        width={24}
        height={24}
        style={{ display: "inline-block" }}
      />
    ),
  },
  { code: "kh", label: "Khmer", flag: (
      <Image
        src="/icons/world.svg"
        alt="Khmer"
        width={24}
        height={24}
        style={{ display: "inline-block" }}
      />
    ), },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === locale);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition"
        onClick={() => setOpen((v) => !v)}
        aria-label="Select language"
        type="button"
      >
        <span className="text-xl">{current?.flag}</span>
        <span className="font-medium">{current?.label}</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 ${
                locale === lang.code ? "font-bold" : ""
              }`}
              onClick={() => {
                setLocale(lang.code as "en" | "kh");
                setOpen(false);
              }}
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
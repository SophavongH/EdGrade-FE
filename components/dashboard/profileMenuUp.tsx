"use client";
import { useEffect, useState, useRef } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Ellipsis, UserRoundPen, ChevronDown, Languages } from "lucide-react";
import { useLanguage } from "@/lib/LanguageProvider";

type Props = {
  name?: string;
  email?: string;
};

export default function ProfileMenuUp({
  name,
  email,
}: Props) {
  const [open, setOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();

  // Sync language with localStorage on mount
  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if ((storedLang === "en" || storedLang === "kh") && storedLang !== lang) {
      setLang(storedLang as "en" | "kh");
    }
    // eslint-disable-next-line
  }, []);

  // Save language to localStorage and update context
  const handleLangChange = (newLang: "en" | "kh") => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    setLangDropdown(false);
  };

  const displayName = name && name.trim() ? name : t("user");
  const displayEmail = email && email.trim() ? email : "user@example.com";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setLangDropdown(false);
      }
    }
    if (open || langDropdown) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, langDropdown]);

  // Logout using cookie-based auth
  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="ml-1 flex items-center justify-center rounded-full"
        title={t("openMenu")}
        onClick={() => setOpen((v) => !v)}
      >
        <Ellipsis className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 max-w-[90vw] bg-white rounded-xl shadow-xl border z-50 animate-fade-in-up p-0"
          style={{ minWidth: 220 }}
        >
          <div className="p-4 border-b">
            <div className="font-bold">{displayName}</div>
            <div className="text-xs text-gray-500 truncate">{displayEmail}</div>
          </div>
          <button
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 font-semibold text-gray-700"
            onClick={() => {
              setOpen(false);
              router.push("/profile");
            }}
          >
            <span>
              <UserRoundPen className="w-5 h-5" />
            </span>
            {t("editProfile")}
          </button>
          {/* Language Dropdown */}
          <div className="w-full px-4 py-3 flex items-center gap-3 relative">
            <span className="font-semibold text-gray-700 flex items-center gap-1">
              <Languages className="w-4 h-4 mr-1" />
              {t("language")}
            </span>
            <button
              className="ml-auto flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 transition"
              onClick={() => setLangDropdown((v) => !v)}
              aria-label={t("selectLanguage")}
              type="button"
            >
              {lang === "en" ? (
                <>
                  <span className="ml-1">EN</span>
                </>
              ) : (
                <>
                  <span role="img" aria-label="Cambodia Flag">🇰🇭</span>
                  <span className="ml-1">KH</span>
                </>
              )}
              <ChevronDown className="w-4 h-4" />
            </button>
            {langDropdown && (
              <div className="absolute right-0 top-12 mt-1 w-32 bg-white border rounded shadow z-50">
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
                  onClick={() => handleLangChange("en")}
                >
                  <span role="img" aria-label="UK Flag">🇬🇧</span>
                  <span>EN</span>
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
                  onClick={() => handleLangChange("kh")}
                >
                  <span role="img" aria-label="Cambodia Flag">🇰🇭</span>
                  <span>KH</span>
                </button>
              </div>
            )}
          </div>
          <button
            className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-2 border-t"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" /> {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
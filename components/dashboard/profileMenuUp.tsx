"use client";
import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChevronUp, UserRoundPen, ChevronDown,Languages } from "lucide-react";


type Props = {
  name?: string;
  email?: string;
};

export default function ProfileMenuUp({ name, email }: Props) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "kh">("en");
  const [langDropdown, setLangDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const displayName = name && name.trim() ? name : "User";
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

  return (
    <div className="relative" ref={ref}>
      <button
        className="ml-1 flex items-center justify-center rounded-full"
        title="Open menu"
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronUp className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className={`
            z-50 animate-fade-in-up
            bg-white border shadow-lg
            rounded-lg absolute left-1/2 bottom-full -translate-x-1/2 mb-4 w-64
            max-md:fixed max-md:left-0 max-md:bottom-0 max-md:w-screen max-md:rounded-none max-md:mb-0 max-md:shadow-none
          `}
          style={{ minWidth: 260 }}
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
            </span> Edit profile
          </button>
          {/* Language Dropdown */}
          <div className="w-full px-4 py-3 flex items-center gap-3 relative">
            <span className="font-semibold text-gray-700 flex items-center gap-1">
                <Languages className="w-4 h-4 mr-1" />
              Language
            </span>
            <button
              className="ml-auto flex items-center gap-2 px-3 py-2 rounded  hover:bg-gray-200 transition"
              onClick={() => setLangDropdown((v) => !v)}
              aria-label="Select language"
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
                  onClick={() => {
                    setLang("en");
                    setLangDropdown(false);
                  }}
                >
                  <span role="img" aria-label="UK Flag">🇬🇧</span>
                  <span>EN</span>
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setLang("kh");
                    setLangDropdown(false);
                  }}
                >
                  <span role="img" aria-label="Cambodia Flag">🇰🇭</span>
                  <span>KH</span>
                </button>
              </div>
            )}
          </div>
          <button
            className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-2 border-t"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
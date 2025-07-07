"use client";
import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "@/lib/LanguageProvider";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string) => Promise<void>;
};

export default function CreateReportCardModal({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (open) setTitle("");
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Close on outside click
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t("reportCardNameCannotBeEmpty"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onCreate(title.trim());
      onClose();
    } catch {
      setError(t("failedToCreateReportCard"));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div
      onClick={handleClickOutside}
      className="fixed inset-0 flex justify-center items-center z-50 bg-black/30 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-6 shadow-lg relative w-[370px] max-w-[90vw]"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          {t("createReportCard")}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
            placeholder={t("reportCardName")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#25388C] text-base"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <Button
            type="submit"
            className="bg-[#25388C] hover:bg-[#1e2e6d] text-white w-full py-2 rounded-lg text-base font-medium"
            disabled={loading}
          >
            {loading ? t("creating") : t("create")}
          </Button>
        </form>
      </div>
    </div>
  );
}
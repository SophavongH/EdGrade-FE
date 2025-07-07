import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageProvider";

interface SchoolUserFormProps {
  initial?: { name: string; email: string };
  loading?: boolean;
  onSubmit: (data: { name: string; email: string; password?: string }) => void;
  isEdit?: boolean;
}

export default function SchoolUserForm({
  initial,
  loading,
  onSubmit,
  isEdit = false,
}: SchoolUserFormProps) {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    setName(initial?.name || "");
    setEmail(initial?.email || "");
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && password !== confirm) {
      alert(t("passwordsDoNotMatch"));
      return;
    }
    if (isEdit && password) {
      if (password !== confirm) {
        alert(t("passwordsDoNotMatch"));
        return;
      }
      onSubmit({ name, email, password });
    } else {
      onSubmit({ name, email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label className="block mb-1 font-medium">{t("schoolName")}</label>
        <input
          className="w-full border rounded px-4 py-2"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={t("enterSchoolName")}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">{t("email")}</label>
        <input
          className="w-full border rounded px-4 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={t("enterEmail")}
          required
          type="email"
        />
      </div>
      {!isEdit && (
        <>
          <div>
            <label className="block mb-1 font-medium">{t("password")}</label>
            <input
              className="w-full border rounded px-4 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t("enterPassword")}
              required
              type="password"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t("confirmPassword")}</label>
            <input
              className="w-full border rounded px-4 py-2"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder={t("enterConfirmPassword")}
              required
              type="password"
            />
          </div>
        </>
      )}
      {isEdit && (
        <>
          <div>
            <label className="block mb-1 font-medium">{t("newPassword")}</label>
            <input
              className="w-full border rounded px-4 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t("enterNewPassword")}
              type="password"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">{t("confirmNewPassword")}</label>
            <input
              className="w-full border rounded px-4 py-2"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder={t("confirmNewPasswordPlaceholder")}
              type="password"
            />
          </div>
        </>
      )}
      <Button
        type="submit"
        className="w-full bg-[#25388C] hover:bg-[#1e2e6d] text-white"
        disabled={loading}
      >
        {loading
          ? isEdit
            ? t("editing")
            : t("creating")
          : isEdit
          ? t("edit")
          : t("create")}
      </Button>
    </form>
  );
}
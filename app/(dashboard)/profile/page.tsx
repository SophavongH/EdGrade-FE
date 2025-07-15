/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageProvider";
import Image from "next/image";
import SchoolSidebar from "@/components/dashboard/Schoolsidebar";
import Sidebar from "@/components/dashboard/Sidebar";

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    avatar: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user info on mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
      credentials: "include",
    })
      .then(res => {
        if (res.status === 401) {
          router.replace("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setForm(f => ({
          ...f,
          name: data.name || "",
          email: data.email || "",
          avatar: data.avatar || "",
        }));
        setImage(data.avatar || null);
        setRole(data.role);
        setSession({ user: data });
      })
      .finally(() => setPageLoading(false));
  }, [router]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setForm(f => ({ ...f, avatar: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
      alert(t("passwordsDoNotMatch"));
      return;
    }
    setLoading(true);
    const payload: any = {
      name: form.name,
      email: form.email,
      avatar: form.avatar,
    };
    if (form.newPassword) payload.password = form.newPassword;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      // Refetch updated user profile
      const updatedUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        credentials: "include",
      }).then(r => r.json());
      setSession({ user: updatedUser }); // update session with new avatar
      alert(t("profileUpdated"));
      router.refresh();
    } else {
      alert(t("failedToUpdateProfile"));
    }
  };

  if (pageLoading || !session) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <Image src="/icons/math.gif" alt="Loading..." width={80} height={80} />
        <span className="mt-4 text-lg">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F7FB]">
      {/* Sidebar */}
      <div className="hidden md:block">
        {role === "user" ? (
          <SchoolSidebar session={session} />
        ) : (
          <Sidebar session={session} />
        )}
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-8 text-center">{t("editProfile")}</h1>
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            {/* Avatar upload */}
            <div
              className="w-36 h-36 rounded-full bg-orange-200 flex items-center justify-center cursor-pointer mb-6 overflow-hidden mx-auto"
              onClick={handleImageClick}
            >
              {image ? (
                <Image
                  src={image}
                  alt={t("profile")}
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              ) : (
                <span className="text-6xl text-white">+</span>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t("name")}</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
                placeholder={t("enterName")}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t("email")}</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
                placeholder={t("enterEmail")}
                required
                type="email"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t("newPassword")}</label>
              <input
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
                placeholder={t("enterNewPassword")}
                type="password"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t("confirmNewPassword")}</label>
              <input
                name="confirmNewPassword"
                value={form.confirmNewPassword}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
                placeholder={t("confirmNewPasswordPlaceholder")}
                type="password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#25388C] hover:bg-[#1e2e6d] text-white text-lg"
              disabled={loading}
            >
              {loading ? t("editing") : t("edit")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
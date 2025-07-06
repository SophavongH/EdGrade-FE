"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { getUserInfo, Session } from "@/lib/user";
import SchoolUserForm from "@/components/dashboard/SchoolUserForm";
import { useLanguage } from "@/lib/LanguageProvider";
import Image from "next/image";

export default function EditSchoolUser() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { t } = useLanguage();

  const [session, setSession] = useState<Session | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    getUserInfo(token)
      .then((user) => {
        if (user.role === "admin") {
          setSession({ user });
        } else {
          router.replace("/unauthorized");
        }
      })
      .catch(() => {
        router.replace("/login");
      });

    // Fetch school user data
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/school/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setInitial({ name: data.name, email: data.email }))
      .finally(() => setPageLoading(false));
  }, [router, id]);

  // This handles the actual update API call
  const handleUpdate = async (data: { name: string; email: string; password?: string }) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/school/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
    } else {
      alert(t("failedToUpdateSchool"));
    }
  };

  if (pageLoading)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <Image src="/icons/math.gif" alt="Loading..." width={80} height={80} />
        <span className="mt-4 text-lg">{t("loading")}</span>
      </div>
    );
  if (!session) return null;

  return (
    <div className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} />
      <main className="flex-1 p-8 bg-[#F8F8FF]">
        <h1 className="text-2xl font-bold mb-6 pb-6">{t("welcome")}, {session.user.name}</h1>
        <Button className="mb-6 bg-[#25388C] hover:bg-[#1e2e6d] text-white" onClick={() => router.back()}>
          {t("goBack")}
        </Button>
        <h1 className="text-2xl font-bold mb-6">{t("editSchool")}</h1>
        {initial && (
          <SchoolUserForm onSubmit={handleUpdate} loading={loading} initial={initial} isEdit />
        )}
      </main>
    </div>
  );
}
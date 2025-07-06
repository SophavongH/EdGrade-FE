"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { getUserInfo, Session } from "@/lib/user";
import SchoolTable from "@/components/dashboard/schoolTable";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageProvider";
import Image from "next/image";

type School = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status?: string;
};

type Stats = {
  total: number;
  active: number;
  deactivated: number;
};

const Page = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const router = useRouter();
  const { t } = useLanguage();

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
          // Fetch dashboard data
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((data) => {
              setStats(data.stats);
              setSchools(data.schools);
            });
        } else {
          router.replace("/unauthorized");
        }
      })
      .catch(() => {
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading)
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
        <h1 className="text-2xl font-bold mb-6">{t("welcome")}, {session.user.name}</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <div className="text-3xl font-bold text-[#25388C]">{stats?.total ?? "-"}</div>
            <div className="text-gray-600 mt-2">{t("school")}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <div className="text-3xl font-bold text-[#25388C]">{stats?.active ?? "-"}</div>
            <div className="text-gray-600 mt-2">{t("active")}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <div className="text-3xl font-bold text-[#25388C]">{stats?.deactivated ?? "-"}</div>
            <div className="text-gray-600 mt-2">{t("deactivated")}</div>
          </div>
        </div>

        {/* School Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold mb-4">{t("school")}</h2>
            <Button
              className="mt-4 bg-[#25388C] hover:bg-[#1e2e6d] text-white"
              onClick={() => router.push("/admin/new")}
            >
              + {t("createNewSchool")}
            </Button>
          </div>
          <SchoolTable schools={schools} setSchools={setSchools} />
        </div>
      </main>
    </div>
  );
};

export default Page;
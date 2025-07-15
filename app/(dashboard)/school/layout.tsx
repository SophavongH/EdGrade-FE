"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SchoolSidebar from "@/components/dashboard/Schoolsidebar";
import Header from "@/components/dashboard/Header";
import { getUserInfo, Session } from "@/lib/user";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getUserInfo()
      .then((user) => {
        if (user.role === "user") {
          setSession({ user });
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
        <Image
          priority
          src="/icons/math.gif"
          alt="Loading..."
          width={64}
          height={64}
          className="mb-4 h-16 w-16"
          unoptimized
        />
      </div>
    );
  if (!session) return null;

  return (
    <main className="flex min-h-screen w-full flex-row">
      <SchoolSidebar session={session} />
      <div className="flex w-[calc(100%-264px)] flex-1 flex-col bg-[#F8F8FF] p-5 sm:p-10">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
}
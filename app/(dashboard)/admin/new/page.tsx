"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { getUserInfo, Session } from "@/lib/user";
import SchoolUserForm from "@/components/dashboard/SchoolUserForm";

export default function CreateSchoolUser() {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();

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
      })
      .finally(() => setPageLoading(false));
  }, [router]);

  const handleSubmit = async (data: { name: string; email: string; password?: string }) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/create-school-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    setLoading(false);
    const result = await res.json();
    if (res.ok) {
      router.push("/admin");
    } else if (res.status === 409 && result.error) {
      alert(result.error); // Shows "Email already exists"
    } else {
      alert("Failed to create user");
    }
  };

  if (pageLoading)
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  if (!session) return null;

  return (
    <div className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} />
      <main className="flex-1 p-8 bg-[#F8F8FF]">
        <h1 className="text-2xl font-bold mb-6 pb-6">Welcome, {session.user.name}</h1>
        <Button className="mb-6 bg-[#25388C] hover:bg-[#1e2e6d] text-white" onClick={() => router.back()}>
          Go back
        </Button>
        <h1 className="text-2xl font-bold mb-6">Create New School</h1>
        <SchoolUserForm onSubmit={handleSubmit} loading={loading} />
      </main>
    </div>
  );
}
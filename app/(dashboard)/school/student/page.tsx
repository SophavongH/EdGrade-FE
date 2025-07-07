"use client";
import React, { useEffect, useState } from "react";
import { fetchStudents } from "@/lib/api";
import StudentTable from "@/components/dashboard/studentTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Student } from "@/types/student";
import { useLanguage } from "@/lib/LanguageProvider";

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchStudents()
      .then(setStudents)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{t("totalStudents")}</h1>
        <Button className="bg-[#25388C] hover:bg-[#1e2e6d]" asChild>
          <Link href="/school/student/newStudents">
            + {t("createNewStudent")}
          </Link>
        </Button>
      </div>
      <div className="mt-4 pt-3">
        {loading ? (
          <div>{t("loading")}</div>
        ) : (
          <StudentTable students={students} setStudents={setStudents} />
        )}
      </div>
    </section>
  );
}
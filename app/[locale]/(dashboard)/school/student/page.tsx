"use client";
import React, { useEffect, useState } from "react";
import { fetchStudents } from "@/lib/api";
import StudentTable from "@/components/dashboard/studentTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Student } from "@/types/student";

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents()
      .then(setStudents)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Total Students</h1>
        <Button className="bg-[#25388C] hover:bg-[#1e2e6d] "asChild>
          <Link href="/school/student/newStudents">
            + Create New Student
          </Link>
        </Button>
      </div>
      <div className="mt-4 pt-3">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <StudentTable students={students} setStudents={setStudents} />
        )}
      </div>
    </section>
  );
}
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchClassroomById, fetchClassroomStudents, fetchReportCards } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageProvider";
import StudentTable from "@/components/dashboard/studentTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Student } from "@/types/student";

type Classroom = {
  id: string | number;
  name: string;
  totalStudents: number;
};



type ReportCard = {
  id: number;
  title: string;
  createdBy: string;
  createdAt: string;
  creatorName?: string;
};

export default function ArchivedClassroomDetailPage() {
  const params = useParams();
  const classroomId = params.id as string;
  const { t } = useLanguage();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cls, stu, rc]: [Classroom, Student[], ReportCard[]] = await Promise.all([
          fetchClassroomById(classroomId),
          fetchClassroomStudents(classroomId),
          fetchReportCards(classroomId),
        ]);
        setClassroom(cls);
        setStudents(
          stu.map((s) => ({
            ...s,
            phone: s.phone ?? "",
          }))
        );
        setReportCards(rc);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [classroomId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-10">
        <span className="text-gray-400">{t("loadingClassrooms")}</span>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="flex flex-col items-center py-10">
        <span className="text-red-500">{t("failedToFetchSchool")}</span>
      </div>
    );
  }

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <h2 className="text-xl font-semibold">
          {classroom.name} ({t("archivedClassroom")})
        </h2>
        <Link href="/school/archived">
          <Button variant="secondary">{t("back")}</Button>
        </Link>
      </div>
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-2">{t("students")}</h3>
        <StudentTable students={students} setStudents={() => {}} />
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">{t("reportCard")}</h3>
        {reportCards.length === 0 ? (
          <div className="text-gray-400">{t("noReportCardsYet")}</div>
        ) : (
          <ul className="divide-y">
            {reportCards.map((rc) => (
              <li key={rc.id} className="py-2 flex items-center justify-between">
                <span>{rc.title}</span>
                <Link
                  href={`/school/classrooms/${classroom.id}/report-cards/${rc.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {t("view")}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
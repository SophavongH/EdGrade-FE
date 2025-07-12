"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageProvider";

type ReportStudent = {
  id?: string;
  name?: string;
  gender?: string;
  avatar?: string;
};

type ReportScore = {
  [subject: string]: string | number | undefined;
  absent?: string;
  total?: string;
  average?: string;
  grade?: string;
  rank?: string;
};

type ReportData = {
  student?: ReportStudent;
  score?: ReportScore;
  subjects?: string[];
  totalStudents?: number;
};

export default function ReportViewPage() {
  const { token } = useParams();
  const { t } = useLanguage();
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${apiUrl}/api/report/${token}`)
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Invalid or expired link")
      )
      .then(setReport)
      .catch(() => setError("This link is invalid or has already been used."));
  }, [token]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!report) return <div>Loading...</div>;

  const student = report.student || {};
  const score = report.score || {};
  const subjectsToShow = report.subjects || [];
  const totalStudents = typeof report.totalStudents === "number"
    ? report.totalStudents
    : "-";

  return (
    <div className="max-w-xs mx-auto bg-white rounded-2xl shadow-lg p-4 mt-4 border-2 border-blue-100 font-[Kantumruy]">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-2">
        <Image
          src="/icons/admin/logo.svg"
          alt="EdGrade"
          width={32}
          height={32}
          className="w-8 h-8"
        />
        <span className="text-[#25388C] font-bold text-2xl">EdGrade</span>
      </div>
      <hr className="my-2 border-dotted border-gray-300" />

      {/* Avatar and Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-24 h-24 rounded-full bg-orange-200 overflow-hidden flex items-center justify-center border-4 border-white shadow">
          {student.avatar ? (
            <Image
              src={
                student.avatar.startsWith("http") || student.avatar.startsWith("data:")
                  ? student.avatar
                  : `https://ik.imagekit.io/edgrade/${student.avatar}`
              }
              alt={student.name || "Student"}
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded-full"
              unoptimized
            />
          ) : (
            <span className="text-4xl font-bold text-white select-none">
              {student.name
                ? student.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                : "?"}
            </span>
          )}
        </div>
        <div className="font-bold">
          <div>Name: {student.name || "-"}</div>
          <div>{student.gender || ""}</div>
          <div className="text-xs">{student.id || ""}</div>
        </div>
      </div>

      {/* Table */}
      <div className="flex bg-gray-600 text-white px-3 py-2 rounded-t font-bold">
        <div>{t("subject")}</div>
        <div className="ml-auto">{t("score")}</div>
      </div>
      <table className="w-full border-collapse">
        <tbody>
          {subjectsToShow.map((subjectKey: string, idx: number) => (
            <tr key={subjectKey} className={idx % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="px-2 py-1 text-[15px]">{t(subjectKey)}</td>
              <td className="px-2 py-1 text-right">{String(score[subjectKey])}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-between mt-4 text-[15px]">
        <div>
          <div>
            Grade: <span className="font-bold">{score.grade || "-"}</span>
          </div>
          <div>
            Absent: <span className="font-bold">{score.absent || "0"}</span>
          </div>
        </div>
        <div>
          <div>
            Total Scores: <span className="font-bold">{score.total || "-"}</span>
          </div>
          <div>
            Total Students: <span className="font-bold">{totalStudents}</span>
          </div>
          <div>
            Average: <span className="font-bold">{score.average || "-"}</span>
          </div>
          <div>
            Ranking: <span className="font-bold">{score.rank || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

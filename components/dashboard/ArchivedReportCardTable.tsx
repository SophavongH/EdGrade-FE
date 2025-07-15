/// Newly ADD for Testing
import { useEffect, useState } from "react";
import { fetchReportCardScores, fetchReportCards, fetchClassroomStudents } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageProvider";

// Define proper types
type Student = {
  id: number;
  name: string;
  // Add other fields if needed
};

type ReportCard = {
  id: number;
  title: string;
  subjects: string[];
  // Add other fields if needed
};

type Score = {
  [studentId: number]: {
    absent?: number | string;
    total?: number | string;
    average?: number | string;
    grade?: string;
    rank?: number | string;
    [subject: string]: number | string | undefined;
  };
};

type Props = {
  classroomId: number;
  reportCardId: number;
  onClose: () => void;
};

export default function ArchivedReportCardTable({ classroomId, reportCardId, onClose }: Props) {
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [reportCard, setReportCard] = useState<ReportCard | null>(null);
  const [scores, setScores] = useState<Score>({});
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [stu, cards, scoreData] = await Promise.all([
          fetchClassroomStudents(String(classroomId)),
          fetchReportCards(String(classroomId)),
          fetchReportCardScores(String(reportCardId)),
        ]);
        setStudents(stu as Student[]);
        const found = (cards as ReportCard[]).find((c) => c.id === reportCardId);
        setReportCard(found || null);
        setSubjects(found?.subjects || []);
        setScores(scoreData as Score || {});
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [classroomId, reportCardId]);

  if (loading) return <div>{t("loading")}</div>;
  if (!reportCard) return <div>{t("noReportCardsYet")}</div>;

  return (
    <section className="w-full rounded-2xl bg-white p-7 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">{reportCard.title}</h1>
        <button className="text-gray-500 hover:text-black" onClick={onClose}>{t("goBack")}</button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#6C6F7F] text-white uppercase text-xs">
            <tr>
              <th className="px-4 py-3">{t("name")}</th>
              <th className="px-4 py-3">{t("absent")}</th>
              {subjects.map((subjectKey) => (
                <th key={subjectKey} className="px-4 py-3">{t(subjectKey)}</th>
              ))}
              <th className="px-4 py-3">{t("total")}</th>
              <th className="px-4 py-3">{t("average")}</th>
              <th className="px-4 py-3">{t("grade")}</th>
              <th className="px-4 py-3">{t("ranking")}</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu) => {
              const score = scores[stu.id] || {};
              return (
                <tr key={stu.id} className="border-b">
                  <td className="px-4 py-2">{stu.name}</td>
                  <td className="px-4 py-2 text-center">{score.absent ?? ""}</td>
                  {subjects.map((subjectKey) => (
                    <td key={subjectKey} className="px-4 py-2 text-center">
                      {score[subjectKey] ?? ""}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-center font-semibold">{score.total ?? ""}</td>
                  <td className="px-4 py-2 text-center font-semibold">{score.average ?? ""}</td>
                  <td className="px-4 py-2 text-center font-semibold">{score.grade ?? ""}</td>
                  <td className="px-4 py-2 text-center font-semibold">{score.rank ?? ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
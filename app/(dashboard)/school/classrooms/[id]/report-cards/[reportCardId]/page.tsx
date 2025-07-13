/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  fetchClassroomStudents,
  fetchReportCards,
  saveReportCardScores,
  fetchReportCardScores,
  sendReportCardSMS,
  fetchCustomSubjects,
  addCustomSubject,
  deleteCustomSubject,
  saveReportCardSubjects,
} from "@/lib/api";
import { useParams } from "next/navigation";
import type { Student } from "@/types/student";
import { useLanguage } from "@/lib/LanguageProvider";

type ReportCard = {
  id: string | number;
  title: string;
};

type StudentScores = {
  [studentId: string]: {
    absent: string;
    [subjectKey: string]: string; // subject scores by key
    total: string;
    average: string;
    grade: string;
    rank: string;
  };
};

const SUBJECT_KEYS = [
  "khmerLiterature",
  "mathematics",
  "biology",
  "chemistry",
  "physics",
  "history",
  // ...add all your subject keys here
];

function getGrade(average: number) {
  if (average >= 40) return "ល្អ";
  if (average >= 33) return "ល្អបង្គូរ";
  if (average >= 25) return "មធ្យម";
  return "ខ្សោយ";
}

export default function ReportCardDetailPage() {
  const params = useParams();
  const classroomId = params.id as string;
  const reportCardId = params.reportCardId as string;
  const { t } = useLanguage();

  const DEFAULT_SUBJECTS = useMemo(() => SUBJECT_KEYS, []);
  const [students, setStudents] = useState<Student[]>([]);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(DEFAULT_SUBJECTS);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportCard, setReportCard] = useState<ReportCard | null>(null);

  const [scores, setScores] = useState<StudentScores>({});
  const [saving, setSaving] = useState(false);
  const [customSubjects, setCustomSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [subjectLoading, setSubjectLoading] = useState(false);

  useEffect(() => {
    if (!classroomId || isNaN(Number(classroomId))) {
      setError(t("invalidClassroomId"));
      return;
    }
    setError(null);
    fetchClassroomStudents(classroomId)
      .then((data) => {
        setStudents(data);
        setScores((prev) => {
          const newScores = { ...prev };
          data.forEach((stu: Student) => {
            if (!newScores[stu.id]) {
              newScores[stu.id] = {
                absent: "",
                ...Object.fromEntries(DEFAULT_SUBJECTS.map((key) => [key, ""])),
                total: "",
                average: "",
                grade: "",
                rank: "",
              };
            }
          });
          return newScores;
        });
      })
      .catch(() => setError(t("failedToFetchStudents")));
  }, [classroomId, t, DEFAULT_SUBJECTS]);

  useEffect(() => {
    if (!classroomId) return;
    fetchReportCards(classroomId)
      .then((cards: ReportCard[]) => {
        const found = cards.find((c) => String(c.id) === String(reportCardId));
        setReportCard(found || null);
      })
      .catch(() => setReportCard(null));
  }, [classroomId, reportCardId]);

  useEffect(() => {
    if (!reportCardId) return;
    fetchReportCardScores(reportCardId)
      .then((data) => {
        setScores((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {});
  }, [reportCardId]);

  useEffect(() => {
    fetchCustomSubjects()
      .then(setCustomSubjects)
      .catch(() => setCustomSubjects([]));
  }, []);

  useEffect(() => {
    if (selectAll) {
      setSelectedStudentIds(students.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  }, [selectAll, students]);

  const handleSubjectChange = (subjectKey: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectKey)
        ? prev.filter((s) => s !== subjectKey)
        : [...prev, subjectKey]
    );
  };

  const handleStudentCheck = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleScoreChange = (
    studentId: string,
    field: string,
    value: string
  ) => {
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleAddSubject = async () => {
    const subjectKey = newSubject.trim();
    if (
      subjectKey &&
      !selectedSubjects.includes(subjectKey) &&
      !DEFAULT_SUBJECTS.includes(subjectKey) &&
      !customSubjects.includes(subjectKey)
    ) {
      setSubjectLoading(true);
      try {
        await addCustomSubject(subjectKey);
        setCustomSubjects((prev) => [...prev, subjectKey]);
        setSelectedSubjects((prev) => [...prev, subjectKey]);
        setNewSubject("");
      } catch {
        alert(t("failedToAddSubject"));
      } finally {
        setSubjectLoading(false);
      }
    }
  };

  const handleRemoveCustomSubject = async (subjectKey: string) => {
    setSubjectLoading(true);
    try {
      await deleteCustomSubject(subjectKey);
      setCustomSubjects((prev) => prev.filter((s) => s !== subjectKey));
      setSelectedSubjects((prev) => prev.filter((s) => s !== subjectKey));
    } catch {
      alert(t("failedToRemoveSubject"));
    } finally {
      setSubjectLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveReportCardSubjects(reportCardId, selectedSubjects);

      const tableSubjects = [...selectedSubjects];
      const totals = students.map((stu) =>
        tableSubjects.reduce((sum, subjectKey) => {
          const val = Number(scores[stu.id]?.[subjectKey] || 0);
          return sum + (isNaN(val) ? 0 : val);
        }, 0)
      );
      const sortedTotals = [...totals]
        .map((total, idx) => ({ total, idx }))
        .sort((a, b) => b.total - a.total);
      const ranks: number[] = Array(students.length).fill(0);
      let currentRank = 1;
      for (let i = 0; i < sortedTotals.length; i++) {
        if (i > 0 && sortedTotals[i].total === sortedTotals[i - 1].total) {
          ranks[sortedTotals[i].idx] = ranks[sortedTotals[i - 1].idx];
        } else {
          ranks[sortedTotals[i].idx] = currentRank;
        }
        currentRank++;
      }

      const payload: Record<string, any> = {};
      students.forEach((stu, idx) => {
        const total = tableSubjects.reduce((sum, subjectKey) => {
          const val = Number(scores[stu.id]?.[subjectKey] || 0);
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
        const average =
          tableSubjects.length > 0
            ? Number((total / tableSubjects.length).toFixed(2))
            : 0;
        const rank = ranks[idx];
        payload[stu.id] = {
          ...scores[stu.id],
          total: String(total),
          average: String(average),
          grade: getGrade(average),
          rank: String(rank),
        };
      });

      await saveReportCardScores(reportCardId, payload);
      alert(t("successfullySavedScores"));
    } catch {
      alert(t("failedToSaveScores"));
    } finally {
      setSaving(false);
    }
  };

  const tableSubjects = [...selectedSubjects];

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">
          {reportCard?.title || t("reportCard")}
        </h1>
        <div className="flex gap-2">
          <Button
            className="bg-[#25388C] hover:bg-[#1e2e6d] text-white"
            onClick={() => setShowSubjectModal(true)}
          >
            {t("selectSubjects")}
          </Button>
          <Button
            className="bg-[#25388C] hover:bg-[#1e2e6d] text-white"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#6C6F7F] text-white uppercase text-xs">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={() => setSelectAll((v) => !v)}
                />
              </th>
              <th className="px-4 py-3">{t("name")}</th>
              <th className="px-4 py-3">{t("absent")}</th>
              {tableSubjects.map((subjectKey) => (
                <th key={subjectKey} className="px-4 py-3">
                  {t(subjectKey)}
                </th>
              ))}
              <th className="px-4 py-3">{t("total")}</th>
              <th className="px-4 py-3">{t("average")}</th>
              <th className="px-4 py-3">{t("grade")}</th>
              <th className="px-4 py-3">{t("ranking")}</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const totals = students.map((stu) =>
                tableSubjects.reduce((sum, subjectKey) => {
                  const val = Number(scores[stu.id]?.[subjectKey] || 0);
                  return sum + (isNaN(val) ? 0 : val);
                }, 0)
              );
              const sortedTotals = [...totals]
                .map((total, idx) => ({ total, idx }))
                .sort((a, b) => b.total - a.total);
              const ranks: number[] = Array(students.length).fill(0);
              let currentRank = 1;
              for (let i = 0; i < sortedTotals.length; i++) {
                if (
                  i > 0 &&
                  sortedTotals[i].total === sortedTotals[i - 1].total
                ) {
                  ranks[sortedTotals[i].idx] = ranks[sortedTotals[i - 1].idx];
                } else {
                  ranks[sortedTotals[i].idx] = currentRank;
                }
                currentRank++;
              }
              return students.map((stu, idx) => {
                const total = totals[idx];
                const average =
                  tableSubjects.length > 0
                    ? Number((total / tableSubjects.length).toFixed(2))
                    : 0;
                const rank = ranks[idx];
                return (
                  <tr key={stu.id} className="border-b">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(stu.id)}
                        onChange={() => handleStudentCheck(stu.id)}
                      />
                    </td>
                    <td className="px-4 py-2">{stu.name}</td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="text"
                        className="w-16 border rounded px-1 py-0.5 text-center"
                        value={scores[stu.id]?.absent || ""}
                        onChange={(e) =>
                          handleScoreChange(stu.id, "absent", e.target.value)
                        }
                      />
                    </td>
                    {tableSubjects.map((subjectKey) => (
                      <td key={subjectKey} className="px-4 py-2 text-center">
                        <input
                          type="text"
                          className="w-16 border rounded px-1 py-0.5 text-center"
                          value={scores[stu.id]?.[subjectKey] || ""}
                          onChange={(e) =>
                            handleScoreChange(stu.id, subjectKey, e.target.value)
                          }
                        />
                      </td>
                    ))}
                    <td className="px-4 py-2 text-center font-semibold">
                      {total}
                    </td>
                    <td className="px-4 py-2 text-center font-semibold">
                      {average}
                    </td>
                    <td className="px-4 py-2 text-center font-semibold">
                      {getGrade(average)}
                    </td>
                    <td className="px-4 py-2 text-center font-semibold">
                      {rank}
                    </td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>
      <Button
        className="mt-8 bg-[#25388C] hover:bg-[#1e2e6d] text-white font-semibold rounded-xl py-2 px-3 text-base"
        style={{ minWidth: 160 }}
        onClick={async () => {
          try {
            await sendReportCardSMS(
              reportCardId,
              selectedStudentIds.length > 0
                ? selectedStudentIds
                : students.map((s) => s.id)
            );
            alert(t("smsSentToParents"));
          } catch {
            alert(t("failedToSendSMS"));
          }
        }}
      >
        {t("send")}
      </Button>
      {/* Subject Selection Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-lg w-[400px] max-w-[90vw] relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-3xl"
              onClick={() => setShowSubjectModal(false)}
            >
              ×
            </button>
            <div className="font-bold text-lg text-center mb-6">
              {t("selectSubjects")}
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {[...DEFAULT_SUBJECTS, ...customSubjects].map((subjectKey) => (
                <label key={subjectKey} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subjectKey)}
                    onChange={() => handleSubjectChange(subjectKey)}
                  />
                  <span>{t(subjectKey)}</span>
                  {customSubjects.includes(subjectKey) && (
                    <button
                      type="button"
                      className="ml-2 text-xs text-red-400 hover:text-red-600"
                      onClick={() => handleRemoveCustomSubject(subjectKey)}
                      title={t("removeCustomSubject")}
                      disabled={subjectLoading}
                    >
                      ×
                    </button>
                  )}
                </label>
              ))}
            </div>
            {/* Add new subject */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder={t("addNewSubject")}
                className="flex-1 border rounded px-2 py-1"
              />
              <button
                type="button"
                className="bg-[#25388C] text-white px-3 py-1 rounded"
                onClick={handleAddSubject}
                disabled={subjectLoading}
              >
                {subjectLoading ? t("adding") : t("add")}
              </button>
            </div>
            <Button
              className="w-full bg-[#25388C] hover:bg-[#1e2e6d] text-white"
              onClick={() => setShowSubjectModal(false)}
            >
              {t("done")}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
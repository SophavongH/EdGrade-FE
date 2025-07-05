"use client";
import { useEffect, useState } from "react";
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
} from "@/lib/api";
import { useParams } from "next/navigation";

const DEFAULT_SUBJECTS = [
  "Khmer Literature",
  "Mathematics",
  "Chemistry",
  "Physics",
  "Biology",
  "History",
];

type Student = {
  id: string;
  name: string;
  avatar?: string;
};

type ReportCard = {
  id: string | number;
  title: string;
};

type StudentScores = {
  [studentId: string]: {
    absent: string;
    [subject: string]: string; // subject scores
    total: string;
    average: string;
    grade: string;
    rank: string;
  };
};

export default function ReportCardDetailPage() {
  const params = useParams();
  const classroomId = params.id as string;
  const reportCardId = params.reportCardId as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedSubjects, setSelectedSubjects] =
    useState<string[]>(DEFAULT_SUBJECTS);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportCard, setReportCard] = useState<ReportCard | null>(null);

  // Editable scores state
  const [scores, setScores] = useState<StudentScores>({});
  const [saving, setSaving] = useState(false);
  const [customSubjects, setCustomSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [subjectLoading, setSubjectLoading] = useState(false);

  // Fetch students
  useEffect(() => {
    if (!classroomId || isNaN(Number(classroomId))) {
      setError("Invalid classroom ID.");
      return;
    }
    setError(null);
    fetchClassroomStudents(classroomId)
      .then((data) => {
        setStudents(data);
        // Initialize scores state for each student if not already set
        setScores((prev) => {
          const newScores = { ...prev };
          data.forEach((stu: Student) => {
            if (!newScores[stu.id]) {
              newScores[stu.id] = {
                absent: "",
                ...Object.fromEntries(DEFAULT_SUBJECTS.map((s) => [s, ""])),
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
      .catch(() => setError("Failed to fetch students for this classroom."));
  }, [classroomId]);

  // Fetch report card info for title
  useEffect(() => {
    if (!classroomId) return;
    fetchReportCards(classroomId)
      .then((cards: ReportCard[]) => {
        const found = cards.find((c) => String(c.id) === String(reportCardId));
        setReportCard(found || null);
      })
      .catch(() => setReportCard(null));
  }, [classroomId, reportCardId]);

  // Fetch report card scores
  useEffect(() => {
    if (!reportCardId) return;
    fetchReportCardScores(reportCardId)
      .then((data) => {
        setScores((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {
        // Optionally handle error
      });
  }, [reportCardId]);

  // Fetch custom subjects from backend
  useEffect(() => {
    fetchCustomSubjects()
      .then(setCustomSubjects)
      .catch(() => setCustomSubjects([]));
  }, []);

  // Handle select all
  useEffect(() => {
    if (selectAll) {
      setSelectedStudentIds(students.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  }, [selectAll, students]);

  // Handle subject selection
  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  // Handle student selection
  const handleStudentCheck = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Handle input change for scores
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

  // Add new subject handler (API)
  const handleAddSubject = async () => {
    const subject = newSubject.trim();
    if (
      subject &&
      !selectedSubjects.includes(subject) &&
      !DEFAULT_SUBJECTS.includes(subject) &&
      !customSubjects.includes(subject)
    ) {
      setSubjectLoading(true);
      try {
        await addCustomSubject(subject);
        setCustomSubjects((prev) => [...prev, subject]);
        setSelectedSubjects((prev) => [...prev, subject]);
        setNewSubject("");
      } catch {
        alert("Failed to add subject.");
      } finally {
        setSubjectLoading(false);
      }
    }
  };

  // Remove custom subject handler (API)
  const handleRemoveCustomSubject = async (subject: string) => {
    setSubjectLoading(true);
    try {
      await deleteCustomSubject(subject);
      setCustomSubjects((prev) => prev.filter((s) => s !== subject));
      setSelectedSubjects((prev) => prev.filter((s) => s !== subject));
    } catch {
      alert("Failed to remove subject.");
    } finally {
      setSubjectLoading(false);
    }
  };

  // Save handler (replace with your API call)
  const handleSave = async () => {
    setSaving(true);
    try {
      // Compute totals, averages, and ranks before saving
      const tableSubjects = [...selectedSubjects];
      const totals = students.map((stu) =>
        tableSubjects.reduce((sum, subject) => {
          const val = Number(scores[stu.id]?.[subject] || 0);
          return sum + (isNaN(val) ? 0 : val);
        }, 0)
      );
      // Ranking logic
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

      // Build the payload with computed fields
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {};
      students.forEach((stu, idx) => {
        const total = totals[idx];
        const average =
          tableSubjects.length > 0
            ? (total / tableSubjects.length).toFixed(2)
            : "0";
        const rank = ranks[idx];
        payload[stu.id] = {
          ...scores[stu.id],
          total: String(total),
          average: String(average),
          rank: String(rank),
        };
      });

      await saveReportCardScores(reportCardId, payload);
      alert("Successfully saved scores!");
      // eslint-disable-next-line
    } catch (err) {
      alert("Failed to save scores.");
    } finally {
      setSaving(false);
    }
  };

  // Table columns
  const tableSubjects = [...selectedSubjects];

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">
          {reportCard?.title || "តារាពិន្ទុ"}
        </h1>
        <div className="flex gap-2">
          <Button
            className="bg-[#25388C] hover:bg-[#1e2e6d] text-white"
            onClick={() => setShowSubjectModal(true)}
          >
            Select Subjects
          </Button>
          <Button
            className="bg-[#25388C] hover:bg-[#1e2e6d] text-white"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Absent</th>
              {tableSubjects.map((subject) => (
                <th key={subject} className="px-4 py-3">
                  {subject}
                </th>
              ))}
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Average</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Ranking</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              // Calculate totals for all students
              const totals = students.map((stu) =>
                tableSubjects.reduce((sum, subject) => {
                  const val = Number(scores[stu.id]?.[subject] || 0);
                  return sum + (isNaN(val) ? 0 : val);
                }, 0)
              );

              // Prepare ranking: sort totals descending, keep track of original indices
              const sortedTotals = [...totals]
                .map((total, idx) => ({ total, idx }))
                .sort((a, b) => b.total - a.total);

              // Assign ranks, handling ties
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
                    ? (total / tableSubjects.length).toFixed(2)
                    : "0";
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
                    {tableSubjects.map((subject) => (
                      <td key={subject} className="px-4 py-2 text-center">
                        <input
                          type="text"
                          className="w-16 border rounded px-1 py-0.5 text-center"
                          value={scores[stu.id]?.[subject] || ""}
                          onChange={(e) =>
                            handleScoreChange(stu.id, subject, e.target.value)
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
                    <td className="px-4 py-2 text-center">
                      <input
                        type="text"
                        className="w-16 border rounded px-1 py-0.5 text-center"
                        value={scores[stu.id]?.grade || ""}
                        onChange={(e) =>
                          handleScoreChange(stu.id, "grade", e.target.value)
                        }
                      />
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
            alert("SMS sent to parents!");
          } catch {
            alert("Failed to send SMS");
          }
        }}
      >
        Send
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
              Select Subjects
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {[...DEFAULT_SUBJECTS, ...customSubjects].map((subject) => (
                <label key={subject} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => handleSubjectChange(subject)}
                  />
                  <span>{subject}</span>
                  {customSubjects.includes(subject) && (
                    <button
                      type="button"
                      className="ml-2 text-xs text-red-400 hover:text-red-600"
                      onClick={() => handleRemoveCustomSubject(subject)}
                      title="Remove custom subject"
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
                placeholder="Add new subject"
                className="flex-1 border rounded px-2 py-1"
              />
              <button
                type="button"
                className="bg-[#25388C] text-white px-3 py-1 rounded"
                onClick={handleAddSubject}
                disabled={subjectLoading}
              >
                {subjectLoading ? "Adding..." : "Add"}
              </button>
            </div>
            <Button
              className="w-full bg-[#25388C] hover:bg-[#1e2e6d] text-white"
              onClick={() => setShowSubjectModal(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

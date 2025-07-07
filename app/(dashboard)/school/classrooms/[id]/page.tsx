"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  fetchClassroomById,
  fetchStudents,
  fetchClassroomStudents,
  addStudentsToClassroom,
  fetchReportCards,
  createReportCard,
  deleteReportCard,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import StudentTable from "@/components/dashboard/studentTable";
import AddStudentModal from "@/components/dashboard/addStudent";
import CreateReportCardModal from "@/components/dashboard/createReportCard";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import type { Student } from "@/types/student";
import { useLanguage } from "@/lib/LanguageProvider";
import Image from "next/image";

type ReportCard = {
  id: number;
  title: string;
  createdBy: string;
  createdAt: string;
  creatorName?: string;
};

const ClassroomName = ({ id }: { id: string }) => {
  const [classroom, setClassroom] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    setLoading(true);
    fetchClassroomById(id)
      .then((data) => {
        setClassroom(data);
        setLoading(false);
      })
      .catch(() => {
        setClassroom(null);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col items-center">
        <Image src="/icons/math.gif" alt="Loading..." width={40} height={40} />
        <span className="text-gray-400 mt-2">{t("loading")}</span>
      </div>
    );
  if (!classroom)
    return <span className="text-red-500">{t("classroomNotFound")}</span>;
  return <span className="text-xl font-semibold">{classroom.name}</span>;
};

const Page = () => {
  const [tab, setTab] = useState(0);
  const params = useParams();
  const { t } = useLanguage();

  // Modal state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // All students for selection (only user's students)
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  // Selected student IDs in modal
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  // Students in this classroom
  const [classroomStudents, setClassroomStudents] = useState<Student[]>([]);

  // Report card state
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [showCreateReportCard, setShowCreateReportCard] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Fetch all students for modal (only user's students)
  useEffect(() => {
    if (showAddStudentModal) {
      fetchStudents().then(setAllStudents);
    }
  }, [showAddStudentModal]);

  // Fetch classroom students for listing
  useEffect(() => {
    if (params.id) {
      fetchClassroomStudents(params.id as string).then(setClassroomStudents);
    }
  }, [params.id, showAddStudentModal]);

  // Fetch report cards
  useEffect(() => {
    if (params.id) {
      fetchReportCards(params.id as string).then(setReportCards);
    }
  }, [params.id, showCreateReportCard]);

  // Add students to classroom
  const handleAddStudents = async () => {
    const result = await addStudentsToClassroom(
      params.id as string,
      selectedStudents
    );
    if (!result.alreadyAdded || result.alreadyAdded.length === 0) {
      setShowAddStudentModal(false);
      setSelectedStudents([]);
      fetchClassroomStudents(params.id as string).then(setClassroomStudents);
    }
    return result;
  };

  // Create report card
  const handleCreateReportCard = async (title: string) => {
    await createReportCard(params.id as string, title);
    setShowCreateReportCard(false);
    fetchReportCards(params.id as string).then(setReportCards);
  };

  // Delete report card
  const handleDeleteReportCard = async () => {
    if (deleteConfirmId) {
      await deleteReportCard(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchReportCards(params.id as string).then(setReportCards);
    }
  };

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex items-center justify-between mb-6">
        {typeof params.id === "string" && <ClassroomName id={params.id} />}
      </div>
      <div className="mt-4 pt-3">
        <div className="bg-[#fafbfc] rounded-2xl p-6">
          <div className="flex items-center justify-between border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button
                className={`pb-2 font-semibold text-base focus:outline-none ${
                  tab === 0
                    ? "border-b-2 border-black text-black"
                    : "text-gray-400 hover:text-black"
                }`}
                onClick={() => setTab(0)}
              >
                {t("reportCard")}
              </button>
              <button
                className={`pb-2 text-base focus:outline-none ${
                  tab === 1
                    ? "border-b-2 border-black text-black font-semibold"
                    : "text-gray-400 hover:text-black"
                }`}
                onClick={() => setTab(1)}
              >
                {t("students")}
              </button>
            </div>
            <div>
              {tab === 0 && (
                <Button
                  className="bg-[#25388C] hover:bg-[#1e2e6d] text-white font-medium text-sm flex items-center gap-2 px-4 py-2 rounded-lg"
                  onClick={() => setShowCreateReportCard(true)}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                    <path
                      d="M9 4v10M4 9h10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {t("createReportCard")}
                </Button>
              )}
              {tab === 1 && (
                <Button
                  className="bg-[#25388C] hover:bg-[#1e2e6d] text-white font-medium text-sm flex items-center gap-2 px-4 py-2 rounded-lg"
                  onClick={() => setShowAddStudentModal(true)}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                    <path
                      d="M9 4v10M4 9h10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {t("addStudentToClassroom")}
                </Button>
              )}
            </div>
          </div>
          {/* Content box */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            {tab === 0 && (
              <div>
                {/* Report Card List */}
                <div className="w-full">
                  {/* Table Header */}
                  <div className="flex items-center px-4 py-2 bg-[#f7f8ff] rounded-t-xl border-b border-gray-200">
                    <div className="flex-1 font-semibold text-sm text-gray-500">
                      {t("reportCard")}
                    </div>
                    <div className="w-32 text-right font-semibold text-sm text-gray-500">
                      {t("action")}
                    </div>
                  </div>
                  {/* Table Body */}
                  <div className="divide-y divide-gray-100 bg-white rounded-b-xl">
                    {reportCards.length === 0 && (
                      <div className="text-gray-400 text-center py-8">
                        {t("noReportCardsYet")}
                      </div>
                    )}
                    {reportCards.map((rc) => (
                      <div key={rc.id} className="flex items-center px-4 py-3">
                        <div className="flex-1 font-bold text-base text-[#25388C]">
                          {rc.title}
                        </div>
                        <div className="w-32 flex justify-end gap-2">
                          <Button
                            asChild
                            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition"
                            title={t("edit")}
                            variant="ghost"
                            size="icon"
                          >
                            <Link
                              href={`/school/classrooms/${params.id}/report-cards/${rc.id}`}
                            >
                              <Pencil size={20} />
                            </Link>
                          </Button>
                          <Button
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                            onClick={() => setDeleteConfirmId(rc.id)}
                            title={t("delete")}
                            variant="ghost"
                            size="icon"
                          >
                            <Trash size={20} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {tab === 1 && (
              <StudentTable
                students={classroomStudents}
                setStudents={setClassroomStudents}
                classroomId={params.id as string}
              />
            )}
          </div>
        </div>
      </div>
      {/* Add Student Modal */}
      <AddStudentModal
        open={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        onAdd={handleAddStudents}
        students={allStudents}
        selected={selectedStudents}
        setSelected={setSelectedStudents}
      />
      {/* Create Report Card Modal */}
      <CreateReportCardModal
        open={showCreateReportCard}
        onClose={() => setShowCreateReportCard(false)}
        onCreate={handleCreateReportCard}
      />
      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-lg w-[350px] max-w-[90vw] flex flex-col items-center">
            <div className="font-bold text-lg mb-6 text-center">
              {t("deleteReportCardConfirm")}
            </div>
            <div className="flex gap-4 w-full justify-center">
              <Button
                className="bg-gray-400 hover:bg-gray-500 text-white w-32"
                onClick={() => setDeleteConfirmId(null)}
              >
                {t("cancel")}
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white w-32"
                onClick={handleDeleteReportCard}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;

"use client";
import { useState, useEffect, useRef } from "react";
import { Pencil, Archive } from "lucide-react";
import { Button } from "../ui/button";
import clsx from "clsx";
import { updateClassroom, archiveClassroom } from "@/lib/api";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageProvider";

type Classroom = {
  id: number;
  name: string;
  totalStudents: number;
  color: string;
};
import type * as React from "react";

type Props = {
  classrooms: Classroom[];
  setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
};

const ITEMS_PER_PAGE = 8;

export default function ClassroomTable({ classrooms, setClassrooms }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(classrooms.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = classrooms.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [newClassName, setNewClassName] = useState("");

  const editModalRef = useRef<HTMLDivElement | null>(null);

  const { t } = useLanguage();

  const handleEdit = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setNewClassName(classroom.name);
    setEditModalOpen(true);
  };

  const handleArchive = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setArchiveModalOpen(true);
  };

  const confirmEdit = async () => {
    if (!selectedClassroom) return;
    try {
      await updateClassroom(selectedClassroom.id, newClassName);
      setClassrooms((prev) =>
        prev.map((cls) =>
          cls.id === selectedClassroom.id ? { ...cls, name: newClassName } : cls
        )
      );
    } catch (err) {
      console.error(err);
    }
    setEditModalOpen(false);
  };

  const confirmArchive = async () => {
    if (!selectedClassroom) return;
    try {
      await archiveClassroom(selectedClassroom.id);
      setClassrooms((prev) =>
        prev.filter((cls) => cls.id !== selectedClassroom.id)
      );
    } catch (err) {
      console.error(err);
    }
    setArchiveModalOpen(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditModalOpen(false);
    };
    if (editModalOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editModalOpen]);

  // Close on outside click
  const handleEditModalClickOutside = (e: React.MouseEvent) => {
    if (
      editModalRef.current &&
      !editModalRef.current.contains(e.target as Node)
    ) {
      setEditModalOpen(false);
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs hidden sm:table-header-group">
            <tr>
              <th className="px-6 py-4">{t("classroomName")}</th>
              <th className="px-6 py-4">{t("totalStudents")}</th>
              <th className="px-6 py-4">{t("view")}</th>
              <th className="px-6 py-4">{t("action")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {currentItems.map((classroom) => (
              <tr key={classroom.id}>
                <td className="px-6 py-4 flex items-center gap-3">
                  <div
                    className={clsx(
                      "w-8 h-8 rounded-full text-white flex items-center justify-center font-bold",
                      classroom.color
                    )}
                  >
                    {classroom.name.charAt(0)}
                  </div>
                  <div className="text-sm font-medium">{classroom.name}</div>
                </td>
                <td className="px-6 py-4">{classroom.totalStudents}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/school/classrooms/${classroom.id}`}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {t("viewClassroom")}
                  </Link>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(classroom)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleArchive(classroom)}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <Archive size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 justify-center mt-4">
        <Button
          className="bg-[#25388C] hover:bg-[#1e2e6d]"
          onClick={() => setCurrentPage((p: number) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          {t("previous")}
        </Button>
        <span className="text-sm text-gray-600">
          {t("page")} {currentPage} {t("of")} {totalPages}
        </span>
        <Button
          className="bg-[#25388C] hover:bg-[#1e2e6d]"
          onClick={() =>
            setCurrentPage((p: number) => Math.min(p + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          {t("next")}
        </Button>
      </div>
      {/* Edit Modal */}
      {editModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={handleEditModalClickOutside}
        >
          <div
            ref={editModalRef}
            className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">{t("editClassroomName")}</h2>
            </div>
            <input
              className="w-full px-4 py-2 border rounded-md mb-4"
              value={newClassName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewClassName(e.target.value)
              }
            />
            <Button
              onClick={confirmEdit}
              className="w-full bg-[#25388C] hover:bg-[#1e2e6d]"
            >
              {t("save")}
            </Button>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {archiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-sm text-center">
            <p className="font-semibold text-gray-800 mb-6">
              {t("archiveConfirm")}
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="secondary"
                onClick={() => setArchiveModalOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button variant="destructive" onClick={confirmArchive}>
                {t("confirm")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

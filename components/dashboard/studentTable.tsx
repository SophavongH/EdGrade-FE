"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { removeStudentFromClassroom, deleteStudent } from "@/lib/api";
import type { Student } from "@/types/student";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";

type Props = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classroomId?: string | number; // <-- Add this prop
};

const ITEMS_PER_PAGE = 8;

export default function StudentTable({ students, setStudents, classroomId }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = students.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudent) return;
    if (classroomId) {
      // Remove from classroom only
      await removeStudentFromClassroom(classroomId, selectedStudent.id);
    } else {
      // Delete from DB (used in student management page)
      await deleteStudent(selectedStudent.id);
    }
    setStudents((prev) => prev.filter((s) => s.id !== selectedStudent.id));
    setDeleteModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-4 relative">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs hidden sm:table-header-group">
            <tr>
              <th className="px-6 py-4 ">Name</th>
              <th className="px-6 py-4 ">Student ID</th>
              <th className="px-6 py-4 ">Sex</th>
              <th className="px-6 py-4 ">Parent&#39;s Phone Number</th>
              <th className="px-6 py-4 ">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {currentItems.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 min-w-[160px]">
                    {student.avatar ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 bg-white">
                        <Image
                          src={student.avatar}
                          alt={student.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-lg text-blue-700 border border-gray-200">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium truncate">
                      {student.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">{student.studentId}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.gender === "Male"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-pink-100 text-pink-600"
                    }`}
                  >
                    {student.gender}
                  </span>
                </td>
                <td className="px-6 py-4">{student.parentPhone}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1.5">
                    <Link href={`/school/student/${student.id}/editStudents`}>
                      <button
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition"
                        title="Edit"
                        type="button"
                      >
                        <Pencil size={18} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(student)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
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
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          className="bg-[#25388C] hover:bg-[#1e2e6d]"
          onClick={() =>
            setCurrentPage((p: number) => Math.min(p + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Edit Modal */}

      {/* Delete Modal */}
      {deleteModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-sm text-center">
            <p className="font-semibold text-gray-800 mb-6">
              Are you sure you want to delete ?
            </p>
            <div className="flex justify-center gap-4 ">
              <Button
                className="bg-gray-400 hover:bg-gray-600 text-white"
                variant="secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

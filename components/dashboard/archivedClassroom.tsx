"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { fetchArchivedClassrooms, unarchiveClassroom } from "@/lib/api";

interface Classroom {
  id: string | number;
  name: string;
  totalStudents: number;
  // Add other properties as needed
}

export default function ArchivedClassroom() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(classrooms.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = classrooms.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  useEffect(() => {
    fetchArchivedClassrooms()
      .then(setClassrooms)
      .finally(() => setLoading(false));
  }, []);

  const handleUnarchive = async (id: string | number) => {
    try {
      await unarchiveClassroom(id);
      setClassrooms((prev) => prev.filter((cls) => cls.id !== id));
    } catch {
      alert("Failed to unarchive classroom");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs hidden sm:table-header-group">
            <tr>
              <th className="px-6 py-4">Classroom Name</th>
              <th className="px-6 py-4">Total Students</th>
              <th className="px-6 py-4">View</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {currentItems.map((classroom, idx) => (
              <tr
                key={classroom.id || idx}
                className="block sm:table-row sm:border-0 border-b border-gray-200 p-4 sm:p-0"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold bg-gray-500`}
                  >
                    {classroom.name?.charAt(0)}
                  </div>
                  <div className="text-sm font-medium">{classroom.name}</div>
                </td>
                <td className="px-6 py-4 sm:table-cell">
                  {classroom.totalStudents}
                </td>
                <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer sm:table-cell">
                  View Classroom
                </td>
                <td className="px-6 py-4 flex sm:table-cell sm:space-x-2 gap-2 sm:justify-start">
                  <Button
                    className="bg-[#25388C] hover:bg-[#1e2e6d]"
                    onClick={() => handleUnarchive(classroom.id)}
                  >
                    Unarchive
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Pagination Controls */}
      <div className="flex items-center gap-4 justify-center mt-4">
        <Button
          className="bg-[#25388C] hover:bg-[#1e2e6d]"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          className="bg-[#25388C] hover:bg-[#1e2e6d]"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
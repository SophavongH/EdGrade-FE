"use client";
import { useEffect, useState } from "react";
import { X, CheckCircle, Search } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import type { Student } from "@/types/student";

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: () => Promise<{ success: boolean; alreadyAdded: { id: string; name: string }[] }>;

  students: Student[];
  selected: string[];
  setSelected: (ids: string[]) => void;
};

export default function AddStudentModal({
  open,
  onClose,
  onAdd,
  students,
  selected,
  setSelected,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [alreadyAdded, setAlreadyAdded] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (open) {
      setSelected([]);
      setSearch("");
      setError(null);
      setAlreadyAdded([]);
    }
  }, [open, setSelected]);

  const handleToggle = (id: string) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((sid) => sid !== id)
        : [...selected, id]
    );
  };

  const handleAdd = async () => {
    setLoading(true);
    setError(null);
    setAlreadyAdded([]);
    try {
      const result = await onAdd();
      if (result.alreadyAdded && result.alreadyAdded.length > 0) {
        setAlreadyAdded(result.alreadyAdded);
        setError(
          `The Student is already added៖ ${result.alreadyAdded.map(s => s.name).join(", ")}`
        );
      } else {
        onClose();
      }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.error || "Successfully added students");
    }
    setLoading(false);
  };

  // Filter students by search
  const filteredStudents = students.filter((stu) =>
    stu.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg relative w-full max-w-md px-0 py-0">
        {/* Modal Header */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black"
          aria-label="Close"
        >
          <X size={32} />
        </button>
        <div className="pt-10 pb-2 flex flex-col items-center">
          <h2
            className="text-2xl font-bold text-[#25388C] text-center"
            style={{ fontFamily: "inherit", letterSpacing: 1 }}
          >
            Add Students
          </h2>
        </div>
        {/* Search box */}
        <div className="w-full px-8 pt-2 pb-2">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Searching Student..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#25388C] text-base"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        {/* Error message */}
        {error && (
          <div className="px-8 pb-2">
            <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm mb-2">
              {error}
            </div>
          </div>
        )}
        {/* Student list */}
        <div className="w-full px-8 pb-0 pt-2">
          {filteredStudents.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No students found
            </div>
          )}
          <div className="flex flex-col gap-4 max-h-72 overflow-y-auto">
            {filteredStudents.map((stu) => (
              <div
                key={stu.id}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition
                  ${
                    selected.includes(stu.id)
                      ? "bg-[#F1F7FF] border-2 border-[#3B82F6]"
                      : "bg-[#F6F8FA] border border-transparent hover:border-[#B9C6E4]"
                  }`}
                onClick={() => handleToggle(stu.id)}
              >
                {stu.avatar ? (
                  <Image
                    src={stu.avatar}
                    alt={stu.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-12 h-12"
                  />
                ) : (
                  <span className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-lg text-green-700">
                    {stu.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
                <span className="font-bold text-lg text-gray-900 flex-1">
                  {stu.name}
                </span>
                {selected.includes(stu.id) && (
                  <CheckCircle
                    size={32}
                    className="text-blue-500 flex-shrink-0"
                    fill="#3B82F6"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Confirm Button */}
        <div className="flex justify-center px-8 pt-8 pb-8">
          <Button
            className={`w-56 h-12 text-lg rounded-xl font-semibold
              ${
                selected.length === 0 || loading
                  ? "bg-[#B9C6E4] text-white cursor-not-allowed"
                  : "bg-[#25388C] hover:bg-[#1e2e6d] text-white"
              }`}
            onClick={handleAdd}
            disabled={loading || selected.length === 0}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
}
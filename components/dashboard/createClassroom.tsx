"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { createClassroom } from "@/lib/api"; // Adjust the import path as needed

type Classroom = {
  id: number;
  name: string;
  totalStudents: number;
  color: string;
};

type Props = {
  classrooms: Classroom[];
  setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
};

const colorOptions = [
  "bg-green-600",
  "bg-blue-500",
  "bg-amber-600",
  "bg-rose-500",
  "bg-sky-600",
  "bg-neutral-800",
  "bg-purple-600",
  "bg-yellow-500",
  "bg-teal-500",
  "bg-indigo-600",
];

export default function CreateClassroomModal({ classrooms, setClassrooms }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [classroomName, setClassroomName] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleCreate = async () => {
    const trimmedName = classroomName.trim();
    if (trimmedName === "") {
      setError("Classroom name cannot be empty.");
      return;
    }

    const isDuplicate = classrooms.some(
      (cls) => cls.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setError("Classroom name already exists.");
      return;
    }

    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    const newClassroom = await createClassroom({ name: trimmedName, color: randomColor });

    setClassrooms([...classrooms, newClassroom]);
    setIsOpen(false);
    setClassroomName("");
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Close on outside click
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-[#25388C] hover:bg-[#1e2e6d] "
      >
        + Create Classroom
      </Button>

      {isOpen && (
        <div
          onClick={handleClickOutside}
          className="fixed inset-0 flex justify-center items-center z-50 bg-black/30 backdrop-blur-sm"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-xl p-6 shadow-lg relative w-[370px] max-w-[90vw]"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Create Classroom
            </h2>
            <input
              type="text"
              value={classroomName}
              onChange={(e) => {
                setClassroomName(e.target.value);
                setError("");
              }}
              placeholder="Classroom Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#25388C] text-base"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <Button
              onClick={handleCreate}
              className="bg-[#25388C] hover:bg-[#1e2e6d] text-white w-full py-2 rounded-lg text-base font-medium"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

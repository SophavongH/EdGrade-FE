"use client";

import React, { useEffect, useState } from "react";
import ClassroomTable from "@/components/dashboard/classroomTable";
import CreateClassroomModal from "@/components/dashboard/createClassroom";
import { fetchClassrooms } from "@/lib/api"; // <-- Backend API

type Classroom = {
  id: number;
  name: string;
  totalStudents: number;
  color: string;
};

const ClassroomPage = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        const data = await fetchClassrooms();
        setClassrooms(data);
      } catch (err) {
        console.error("Failed to load classrooms", err);
      } finally {
        setLoading(false);
      }
    };

    loadClassrooms();
  }, []);

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Classrooms</h2>
        <CreateClassroomModal classrooms={classrooms} setClassrooms={setClassrooms} />
      </div>

      <div className="pt-5 items-center">
        {loading ? (
          <p className="text-gray-500">Loading classrooms...</p>
        ) : (
          <ClassroomTable classrooms={classrooms} setClassrooms={setClassrooms} />
        )}
      </div>
    </section>
  );
};

export default ClassroomPage;

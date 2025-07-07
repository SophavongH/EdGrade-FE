"use client";

import React, { useEffect, useState } from "react";
import ClassroomTable from "@/components/dashboard/classroomTable";
import CreateClassroomModal from "@/components/dashboard/createClassroom";
import { fetchClassrooms } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageProvider";
import Image from "next/image";

type Classroom = {
  id: number;
  name: string;
  totalStudents: number;
  color: string;
};

const ClassroomPage = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

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
        <h2 className="text-xl font-semibold">{t("allClassrooms")}</h2>
        <CreateClassroomModal classrooms={classrooms} setClassrooms={setClassrooms} />
      </div>

      <div className="pt-5 items-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <Image src="/icons/math.gif" alt="Loading..." width={40} height={40} />
            <span className="text-gray-400 mt-2">{t("loadingClassrooms")}</span>
          </div>
        ) : (
          <ClassroomTable classrooms={classrooms} setClassrooms={setClassrooms} />
        )}
      </div>
    </section>
  );
};

export default ClassroomPage;

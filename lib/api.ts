/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "http://localhost:4000/api";

// ---- CLASSROOMS ----

export const fetchClassrooms = async () => {
  const res = await fetch(`${BASE_URL}/classrooms`, {
    credentials: "include", // <-- use cookies
  });
  if (!res.ok) throw new Error("Failed to fetch classrooms");
  return res.json();
};

export const createClassroom = async (data: { name: string; color: string }) => {
  const res = await fetch(`${BASE_URL}/classrooms`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create classroom");
  return res.json();
};

export const updateClassroom = async (id: number, name: string) => {
  const res = await fetch(`${BASE_URL}/classrooms/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to update classroom");
  return res.json();
};

export const archiveClassroom = async (id: number) => {
  const res = await fetch(`${BASE_URL}/classrooms/${id}/archive`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to archive classroom");
  return res.json();
};

export const fetchArchivedClassrooms = async () => {
  const res = await fetch(`${BASE_URL}/classrooms/archived`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch archived classrooms");
  return res.json();
};

export const unarchiveClassroom = async (id: string | number) => {
  const res = await fetch(`${BASE_URL}/classrooms/${id}/unarchive`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to unarchive classroom");
  return res.json();
};

// ---- STUDENTS ----

export const fetchStudents = async () => {
  const res = await fetch(`${BASE_URL}/students`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

export const createStudent = async (data: any) => {
  const res = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create student");
  return res.json();
};

export const updateStudent = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update student");
  return res.json();
};

export const deleteStudent = async (id: string) => {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete student");
  return res.json();
};

export const fetchStudent = async (id: string) => {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch student");
  return res.json();
};

// ---- CLASSROOM BY ID For Detail ----
export const fetchClassroomById = async (id: string | number) => {
  const res = await fetch(`${BASE_URL}/classrooms/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch classroom");
  return res.json();
};
// ---- STUDENTS IN CLASSROOM ----
export const fetchClassroomStudents = async (classroomId: string | number) => {
  const res = await fetch(`${BASE_URL}/classrooms/${classroomId}/students`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch classroom students");
  return res.json();
};

export const addStudentsToClassroom = async (classroomId: string | number, studentIds: string[]) => {
  const res = await fetch(`${BASE_URL}/classrooms/${classroomId}/students`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentIds }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const removeStudentFromClassroom = async (classroomId: string | number, studentId: string) => {
  const res = await fetch(`${BASE_URL}/classrooms/${classroomId}/students/${studentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to remove student from classroom");
  return res.json();
};

// ---- REPORT CARDS ----
export const fetchReportCards = async (classroomId: string) => {
  const res = await fetch(
    `${BASE_URL}/report-cards/classrooms/${classroomId}/report-cards`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch report cards");
  return res.json();
};

export const createReportCard = async (classroomId: string | number, title: string, subjects: string[]) => {
  const res = await fetch(`${BASE_URL}/report-cards/classrooms/${classroomId}/report-cards`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, subjects }),
  });
  if (!res.ok) throw new Error("Failed to create report card");
  return res.json();
};

export const deleteReportCard = async (reportCardId: number) => {
  const res = await fetch(`${BASE_URL}/report-cards/${reportCardId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete report card");
  return res.json();
};

export const saveReportCardScores = async (
  reportCardId: string | number,
  scores: Record<string, any>
) => {
  const res = await fetch(`${BASE_URL}/report-cards/${reportCardId}/scores`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scores }),
  });
  if (!res.ok) throw new Error("Failed to save report card scores");
  return res.json();
};

export const fetchReportCardScores = async (reportCardId: string | number) => {
  const res = await fetch(`${BASE_URL}/report-cards/${reportCardId}/scores`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch report card scores");
  return res.json();
};

export const sendReportCardSMS = async (reportCardId: string | number, studentIds: string[]) => {
  const res = await fetch(`${BASE_URL}/report-cards/${reportCardId}/send-sms`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentIds }),
  });
  if (!res.ok) throw new Error("Failed to send SMS");
  return res.json();
}

// ---- CUSTOM SUBJECTS ----

export async function fetchCustomSubjects() {
  const res = await fetch(`${BASE_URL}/user-subjects`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch custom subjects");
  return res.json();
}

export async function addCustomSubject(subject: string) {
  const res = await fetch(`${BASE_URL}/user-subjects`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject }),
  });
  if (!res.ok) throw new Error("Failed to add subject");
  return res.json();
}

export async function deleteCustomSubject(subject: string) {
  const res = await fetch(`${BASE_URL}/user-subjects`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject }),
  });
  if (!res.ok) throw new Error("Failed to delete subject");
  return res.json();
}

export async function saveReportCardSubjects(reportCardId: string | number, subjects: string[]) {
  const res = await fetch(`${BASE_URL}/report-cards/${reportCardId}/subjects`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subjects }),
  });
  if (!res.ok) throw new Error("Failed to save report card subjects");
  return res.json();
}


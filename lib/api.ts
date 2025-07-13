const BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "http://localhost:4000/api";

// Helper to get token from localStorage
function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---- CLASSROOMS ----

export const fetchClassrooms = async () => {
  const res = await fetch(`${BASE_URL}/classrooms`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch classrooms");
  return res.json();
};

export const createClassroom = async (data: { name: string; color: string }) => {
  const res = await fetch(`${BASE_URL}/classrooms`, {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, getAuthHeaders()),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create classroom");
  return res.json();
};

export const updateClassroom = async (id: number, name: string) => {
  const res = await fetch(`${BASE_URL}/classrooms/${id}`, {
    method: "PATCH",
    headers: Object.assign({ "Content-Type": "application/json" }, getAuthHeaders()),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to update classroom");
  return res.json();
};

export const archiveClassroom = async (id: number) => {
  const res = await fetch(`${BASE_URL}/classrooms/${id}/archive`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to archive classroom");
  return res.json();
};

export const fetchArchivedClassrooms = async () => {
  const res = await fetch(`${BASE_URL}/classrooms/archived`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch archived classrooms");
  return res.json();
};

export const unarchiveClassroom = async (id: string | number) => {
  const res = await fetch(`${BASE_URL}/classrooms/${id}/unarchive`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to unarchive classroom");
  return res.json();
};

// ---- STUDENTS ----

export const fetchStudents = async () => {
  const res = await fetch(`${BASE_URL}/students`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createStudent = async (data: any) => {
  const res = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, getAuthHeaders()),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create student");
  return res.json();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateStudent = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    headers: Object.assign({ "Content-Type": "application/json" }, getAuthHeaders()),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update student");
  return res.json();
};

export const deleteStudent = async (id: string) => {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete student");
  return res.json();
};

export const fetchStudent = async (id: string) => {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch student");
  return res.json();
};

// ---- CLASSROOM BY ID For Detail ----
export const fetchClassroomById = async (id: string | number) => {
  const res = await fetch(`${BASE_URL}/classrooms/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch classroom");
  return res.json();
};
// ---- STUDENTS IN CLASSROOM ----
export const fetchClassroomStudents = async (classroomId: string | number) => {
  const res = await fetch(`${BASE_URL}/classrooms/${classroomId}/students`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch classroom students");
  return res.json();
};

export const addStudentsToClassroom = async (classroomId: string | number, studentIds: string[]) => {
  const res = await fetch(`${BASE_URL}/classrooms/${classroomId}/students`, {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, getAuthHeaders()),
    body: JSON.stringify({ studentIds }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const removeStudentFromClassroom = async (classroomId: string | number, studentId: string) => {
  const res = await fetch(`${BASE_URL}/classrooms/${classroomId}/students/${studentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove student from classroom");
  return res.json();
};

// ---- REPORT CARDS ----
export const fetchReportCards = async (classroomId: string) => {
  const res = await fetch(
    `${BASE_URL}/report-cards/classrooms/${classroomId}/report-cards`,
    {
      headers: getAuthHeaders(),
    }
  );
  if (!res.ok) throw new Error("Failed to fetch report cards");
  return res.json();
};

export const createReportCard = async (classroomId: string | number, title: string) => {
  const res = await fetch(`${BASE_URL}/report-cards/classrooms/${classroomId}/report-cards`, {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, getAuthHeaders()),
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create report card");
  return res.json();
};

export const deleteReportCard = async (reportCardId: number) => {
  const res = await fetch(`${BASE_URL}/report-cards/${reportCardId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete report card");
  return res.json();
};


export const saveReportCardScores = async (
  reportCardId: string | number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scores: Record<string, any>
) => {
  const res = await fetch(`${BASE_URL}/report-cards/${reportCardId}/scores`, {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, getAuthHeaders()),
    body: JSON.stringify({ scores }),
  });
  if (!res.ok) throw new Error("Failed to save report card scores");
  return res.json();
};

export const fetchReportCardScores = async (reportCardId: string | number) => {
  const res = await fetch(`${BASE_URL}/report-cards/${reportCardId}/scores`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch report card scores");
  return res.json();
};

export const sendReportCardSMS = async (reportCardId: string | number, studentIds: string[]) => {
  const res = await fetch(`${BASE_URL}/report-cards/${reportCardId}/send-sms`, {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, getAuthHeaders()),
    body: JSON.stringify({ studentIds }),
  });
  if (!res.ok) throw new Error("Failed to send SMS");
  return res.json();
}

// ---- CUSTOM SUBJECTS ----

export async function fetchCustomSubjects() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/user-subjects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch custom subjects");
  return res.json();
}

export async function addCustomSubject(subject: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/user-subjects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subject }),
  });
  if (!res.ok) throw new Error("Failed to add subject");
  return res.json();
}

export async function deleteCustomSubject(subject: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/user-subjects`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subject }),
  });
  if (!res.ok) throw new Error("Failed to delete subject");
  return res.json();
}

export async function saveReportCardSubjects(reportCardId: string | number, subjects: string[]) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/report-cards/${reportCardId}/subjects`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subjects }),
  });
  if (!res.ok) throw new Error("Failed to save report card subjects");
  return res.json();
}


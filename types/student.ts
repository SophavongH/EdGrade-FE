export type Student = {
  id: string;
  studentId: string;
  name: string;
  avatar?: string;
  phone: string;
  gender: "Male" | "Female";
  parentPhone: string;
  dob?: string;
  address?: string;
};
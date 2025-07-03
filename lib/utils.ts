import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string => {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Save custom subjects for a user to localStorage
export function saveCustomSubjects(userId: string, subjects: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`custom_subjects_${userId}`, JSON.stringify(subjects));
}
export type User = {
  id: string;
  name: string | null;
  email: string;
  role: "admin" | "user";
  password?: string;
  createdAt?: Date | null;
  status?: string | null;
  avatar?: string; // <-- Add this line
};

export type Session = {
  user: User;
};

export const getUserInfo = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
};
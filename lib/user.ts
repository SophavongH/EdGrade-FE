export type User = {
  id: string;
  email: string;
  name?: string;
  role: string;
};

export type Session = {
  user: User;
};

export const getUserInfo = async (token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
};
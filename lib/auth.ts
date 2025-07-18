export async function login(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // <-- important: send cookies!
  });

  if (res.status === 403) {
    return { error: "Account is suspended." };
  }

  const data = await res.json();
  return data;
}

export async function logout() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
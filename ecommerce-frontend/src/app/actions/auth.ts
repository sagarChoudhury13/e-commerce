'use server';

import { cookies } from 'next/headers';

const EXPRESS_API = process.env.NEXT_PUBLIC_API_URL ;

export async function loginAction(email: string, password: string) {
  // 1. Call your Express login route
  const res = await fetch(`${EXPRESS_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // 2. Extract the token and set it in a Next.js cookie
  // data should look like { user: {...}, token: "eyJ..." } from your Express backend
  if (data.token) {
    const cookieStore = await cookies();
    cookieStore.set('token', data.token, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  return data.user;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}
import { cookies } from 'next/headers';

const EXPRESS_API = process.env.NEXT_PUBLIC_API_URL ;

export async function fetchMe() {
  // 1. Get the token from Next.js cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null; // Not logged in
  }

  // 2. Call your Express /me route with the exact header your middleware expects
  const res = await fetch(`${EXPRESS_API}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
  });

  if (!res.ok) {
    return null; // Token might be expired
  }

  return res.json();
}
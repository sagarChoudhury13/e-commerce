"use server"

import { cookies } from "next/headers";

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  
  cookieStore.set("token", token, {
    httpOnly: true, // Prevents JavaScript from reading it (security best practice)
    secure: process.env.NODE_ENV === "production", // Requires HTTPS in production
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // Expires in 1 week
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
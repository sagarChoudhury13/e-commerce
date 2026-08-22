import { LoginForm } from "@/components/auth/LoginForm"; 
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | SHOP XYZ",
  description: "Sign in to your SHOP XYZ account.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-8 min-h-[80vh]">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
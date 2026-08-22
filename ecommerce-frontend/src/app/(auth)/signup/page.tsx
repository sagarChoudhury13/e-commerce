import SignUpForm from "@/components/auth/SignUpform"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp | SHOP XYZ",
  description: "Sign up to a SHOP XYZ account.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-8 min-h-[80vh]">
      <div className="w-full max-w-md">
        <SignUpForm/>
      </div>
    </div>
  );
}
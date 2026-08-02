"use client"
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";



const LoginButton = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  console.log(isAuthenticated())
  return (
    <Link href={'/login'} className="cursor-pointer rounded-xl bg-custom-primary px-3 py-2 text-xs text-custom-background sm:px-4 sm:text-sm md:text-base">
      {
        isAuthenticated() ? "Open Dashboard" : "Clerk Login"
      }
    </Link>

  )
}

export default LoginButton;

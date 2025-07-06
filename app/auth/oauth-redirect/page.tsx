"use client";
import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";

// This page is used as the OAuth redirect URI
// It extracts the token from the URL and updates the UserContext
export default function OAuthRedirectPage() {
  const router = useRouter();
  const { login } = useUser();
   const searchParams = useSearchParams();
  const token = searchParams.get("token");
  useEffect(() => {
    if (token) {
      login(token);
      // Redirect to the dashboard or home page after login
      router.replace("/dashboard");
    } else {
      router.replace("/auth/login");
    }
  }, [router]);

  return <div className="flex min-h-screen items-center justify-center">Connexion en cours...</div>;
}

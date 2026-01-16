"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

const SignIn = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-purple-50 to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (session) {
    router.push("/");
    return null;
  }

  const handleSignIn = async (provider: string) => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/" });
    setLoading(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-purple-50 to-pink-100 p-4">
      <Card className="w-full max-w-md p-6 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Get Started
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Create or access your account instantly
          </p>
        </div>

        {/* Sign In Options */}
        <div className="space-y-3">
          {/* GitHub */}
          <Button
            onClick={() => handleSignIn("github")}
            disabled={loading !== null}
            className="w-full gap-3 bg-black hover:bg-gray-800 text-white transform hover:scale-105 transition-all"
            size="lg"
          >
            {loading === "github" ? "Connecting..." : "Continue with GitHub"}
          </Button>

          {/* Google */}
          <Button
            onClick={() => handleSignIn("google")}
            disabled={loading !== null}
            variant="outline"
            className="w-full gap-3 transform hover:scale-105 transition-all"
            size="lg"
          >
            {loading === "google" ? "Connecting..." : "Continue with Google"}
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-pink-600 hover:text-pink-700 font-semibold transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;

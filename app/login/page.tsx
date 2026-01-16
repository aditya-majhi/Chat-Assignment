"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const Login = () => {
  //   const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  //   if (status === "loading") {
  //     return (
  //       <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
  //           <p className="text-gray-600">Loading...</p>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (session) {
  //     router.push("/");
  //     return null;
  //   }

  const handleSignIn = async (provider: string) => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/dashboard" });
    setLoading(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Sign in to your account to continue
          </p>
        </div>

        <div className="space-y-4">
          {/* GitHub Sign In */}
          <Button
            onClick={() => handleSignIn("github")}
            disabled={loading !== null}
            className="w-full gap-3 bg-gray-900 hover:bg-gray-800 text-white"
            size="lg"
          >
            {loading === "github" ? "Signing in..." : "Sign in with GitHub"}
          </Button>

          {/* Google Sign In */}
          <Button
            onClick={() => handleSignIn("google")}
            disabled={loading !== null}
            variant="outline"
            className="w-full gap-3"
            size="lg"
          >
            {loading === "google" ? "Signing in..." : "Sign in with Google"}
          </Button>
        </div>

        <div className="mt-6 text-center text-xs sm:text-sm text-gray-600">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              href="/signin"
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;

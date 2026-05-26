"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center bg-slate-50 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-100/50 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[100px] pointer-events-none" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Link href="/" className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-900 font-bold tracking-tight">
            UPSC Evaluator
          </div>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to your account to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/70 backdrop-blur-xl py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-white/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Sign up <span aria-hidden="true">&rarr;</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

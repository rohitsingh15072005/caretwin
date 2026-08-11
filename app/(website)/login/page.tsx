"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
    alert("Please fill in all fields.");
    return;
  }

  router.push("/dashboard");
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-center text-cyan-600">
          Welcome Back
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-8">
          Sign in to your CareTwin account
        </p>

        {/* Email */}

        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email Address
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-3 mb-5 outline-none focus:border-cyan-500"
        />

        {/* Password */}

        <label className="block text-sm font-medium text-slate-700 mb-2">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-3 mb-6 outline-none focus:border-cyan-500"
        />

        {/* Login Button */}

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Login
        </button>

        {/* Forgot Password */}

        <div className="text-center mt-4">
          <button
            type="button"
            className="text-cyan-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Signup */}

        <p className="text-center mt-6 text-slate-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-cyan-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}
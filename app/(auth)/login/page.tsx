"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { TextInput, btnPrimary } from "@/components/ui/Field";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    // Demo sign-in: replace with your auth call.
    setTimeout(() => router.push("/dashboard"), 500);
  };

  return (
    <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} onSubmit={submit} noValidate className="rounded-2xl bg-white p-7 shadow-xl sm:p-9">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Welcome back</h1>
      <p className="mb-8 mt-2 text-slate-500">Sign in to your CareTwin account</p>

      <div className="space-y-5">
        <TextInput label="Email address" type="email" autoComplete="email" value={email} error={errors.email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <div className="relative">
          <TextInput label="Password" type={show ? "text" : "password"} autoComplete="current-password" value={password} error={errors.password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="[&_input]:pr-11" />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-[34px] text-slate-400 hover:text-ink">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className={`${btnPrimary} mt-7 w-full py-3`}>
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <div className="mt-4 text-center">
        <button type="button" onClick={() => setForgot((f) => !f)} className="text-sm font-medium text-brand hover:underline">
          Forgot password?
        </button>
        {forgot && <p className="mt-2 text-sm text-slate-500">Password reset will be available once accounts are connected to the cloud.</p>}
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-brand hover:underline">Sign up</Link>
      </p>
    </motion.form>
  );
}

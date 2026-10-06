"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { TextInput, btnPrimary } from "@/components/ui/Field";
import { login, requestPasswordReset } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [serverError, setServerError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!forgot && !password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      if (forgot) {
        await requestPasswordReset(email.trim());
        setResetRequested(true);
        return;
      }

      await login({ email: email.trim(), password });
      router.push("/dashboard");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Request failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      onSubmit={submit}
      noValidate
      className="rounded-2xl bg-white p-7 shadow-xl sm:p-9"
    >
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        {forgot ? "Reset your password" : "Welcome back"}
      </h1>
      <p className="mb-8 mt-2 text-slate-500">
        {resetRequested
          ? `If an account exists for ${email.trim()}, a password reset link has been sent.`
          : forgot
            ? "Enter your account email and we'll send a reset link if an account exists."
            : "Sign in to your CareTwin account"}
      </p>

      {!resetRequested && (
        <div className="space-y-5">
          <TextInput
            label="Email address"
            type="email"
            autoComplete="email"
            value={email}
            error={errors.email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {!forgot && (
            <div className="relative">
              <TextInput
                label="Password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                error={errors.password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="[&_input]:pr-11"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-ink"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}
        </div>
      )}

      {serverError && (
        <p role="alert" className="mt-4 text-sm font-medium text-danger">
          {serverError}
        </p>
      )}

      {!resetRequested && (
        <button
          type="submit"
          disabled={loading}
          className={`${btnPrimary} mt-7 w-full py-3`}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? (forgot ? "Sending…" : "Signing in…") : (forgot ? "Send reset link" : "Sign in")}
        </button>
      )}

      {!resetRequested && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setForgot((value) => !value);
              setErrors({});
              setServerError("");
            }}
            className="text-sm font-medium text-brand hover:underline"
          >
            {forgot ? "Back to sign in" : "Forgot password?"}
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-brand hover:underline">
          Sign up
        </Link>
      </p>
    </motion.form>
  );
}

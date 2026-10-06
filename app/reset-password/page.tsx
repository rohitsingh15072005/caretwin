"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { TextInput, btnPrimary } from "@/components/ui/Field";
import { resetPassword } from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [reset, setReset] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setPasswordError("");
    setConfirmError("");

    const token = new URLSearchParams(window.location.search).get("token") ?? "";
    if (!token) {
      setError("This password reset link is missing its token.");
      return;
    }

    if (password.length < 10) {
      setPasswordError("Use at least 10 characters.");
    } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      setPasswordError("Include a lowercase letter, an uppercase letter, and a number.");
    } else if (new TextEncoder().encode(password).length > 72) {
      setPasswordError("Password must be 72 UTF-8 bytes or fewer.");
    }
    if (password !== confirmPassword) setConfirmError("Passwords do not match.");
    if (
      password.length < 10 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password) ||
      new TextEncoder().encode(password).length > 72 ||
      password !== confirmPassword
    ) {
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setReset(true);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Password reset failed. Request a new link.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (reset) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-7 shadow-xl sm:p-9"
      >
        <h1 className="text-3xl font-bold tracking-tight text-ink">Password updated</h1>
        <p className="mt-3 text-slate-600">Sign in with your new password to continue.</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className={`${btnPrimary} mt-7 w-full py-3`}
        >
          Continue to sign in
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      noValidate
      className="rounded-2xl bg-white p-7 shadow-xl sm:p-9"
    >
      <h1 className="text-3xl font-bold tracking-tight text-ink">Choose a new password</h1>
      <p className="mb-8 mt-2 text-slate-500">
        Use at least 10 characters with lowercase, uppercase, and a number.
      </p>

      <div className="space-y-5">
        <div className="relative">
          <TextInput
            label="New password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            error={passwordError}
            onChange={(event) => setPassword(event.target.value)}
            className="[&_input]:pr-11"
          />
          <button
            type="button"
            onClick={() => setShow((value) => !value)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-[34px] text-slate-400 hover:text-ink"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <TextInput
          label="Confirm new password"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={confirmPassword}
          error={confirmError}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-danger">{error}</p>}

      <button type="submit" disabled={loading} className={`${btnPrimary} mt-7 w-full py-3`}>
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Updating password…" : "Update password"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Back to sign in
        </Link>
      </p>
    </motion.form>
  );
}

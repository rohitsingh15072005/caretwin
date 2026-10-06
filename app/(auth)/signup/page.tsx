"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { TextInput, btnPrimary } from "@/components/ui/Field";
import { register } from "@/lib/api";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 10) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  return s;
}

const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
const colors = ["bg-slate-200", "bg-red-400", "bg-amber-400", "bg-lime-500", "bg-green-500"];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  const score = strength(form.password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const next: typeof errors = {};
    const nameParts = form.name.trim().split(/\s+/).filter(Boolean);
    if (nameParts.length < 2) next.name = "Enter your first and last name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 10) next.password = "Use at least 10 characters.";
    else if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
      next.password = "Include a lowercase letter, an uppercase letter, and a number.";
    } else if (new TextEncoder().encode(form.password).length > 72) {
      next.password = "Password must be 72 UTF-8 bytes or fewer.";
    }
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const [firstName, ...lastName] = nameParts;
      await register({
        firstName,
        lastName: lastName.join(" "),
        email: form.email.trim(),
        password: form.password,
      });
      router.push("/login?registered=1");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Account creation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} onSubmit={submit} noValidate className="rounded-2xl bg-white p-7 shadow-xl sm:p-9">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Create account</h1>
      <p className="mb-8 mt-2 text-slate-500">Join CareTwin AI</p>

      <div className="space-y-4">
        <TextInput label="Full name" autoComplete="name" value={form.name} error={errors.name} onChange={set("name")} />
        <TextInput label="Email address" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={set("email")} />
        <div className="relative">
          <TextInput label="Password" type={show ? "text" : "password"} autoComplete="new-password" value={form.password} error={errors.password} onChange={set("password")} className="[&_input]:pr-11" />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-[34px] text-slate-400 hover:text-ink">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {form.password && (
          <div aria-live="polite">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= score ? colors[score] : "bg-slate-200"}`} />
              ))}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">Password strength: {labels[score]}. Use 10+ characters with lowercase, uppercase, and a number.</p>
          </div>
        )}
        <TextInput label="Confirm password" type={show ? "text" : "password"} autoComplete="new-password" value={form.confirmPassword} error={errors.confirmPassword} onChange={set("confirmPassword")} />
      </div>

      {serverError && <p role="alert" className="mt-4 text-sm font-medium text-danger">{serverError}</p>}

      <button type="submit" disabled={loading} className={`${btnPrimary} mt-7 w-full py-3`}>
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p className="mt-4 text-center text-xs text-slate-500">
        By creating an account you agree to our{" "}
        <Link href="/Legal/Terms_of_Service" className="underline">Terms</Link> and{" "}
        <Link href="/Legal/Privacy_Policy" className="underline">Privacy Policy</Link>.
      </p>

      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">Sign in</Link>
      </p>
    </motion.form>
  );
}

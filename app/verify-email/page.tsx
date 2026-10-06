"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { btnPrimary } from "@/components/ui/Field";
import { verifyEmail } from "@/lib/api";

type VerificationState =
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };

export default function VerifyEmailPage() {
  const [state, setState] = useState<VerificationState>({ status: "loading" });

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    (token
      ? verifyEmail(token)
      : Promise.reject(new Error("This verification link is missing its token.")))
      .then(() => setState({ status: "success" }))
      .catch((error: unknown) =>
        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Email verification failed. Request a new verification email.",
        }),
      );
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-7 shadow-xl sm:p-9"
    >
      {state.status === "loading" ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Verifying email</h1>
          <p className="mt-3 flex items-center gap-2 text-slate-600">
            <Loader2 size={16} className="animate-spin" />
            Please wait while we verify your address.
          </p>
        </>
      ) : state.status === "success" ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Email verified</h1>
          <p className="mt-3 text-slate-600">Your account is ready. Sign in to continue.</p>
          <Link href="/login" className={`${btnPrimary} mt-7 w-full py-3`}>
            Continue to sign in
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Verification failed</h1>
          <p role="alert" className="mt-3 text-slate-600">{state.message}</p>
          <Link href="/login" className={`${btnPrimary} mt-7 w-full py-3`}>
            Back to sign in
          </Link>
        </>
      )}
    </motion.div>
  );
}

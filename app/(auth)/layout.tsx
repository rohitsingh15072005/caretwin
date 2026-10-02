import Link from "next/link";
import { ShieldCheck, Users, QrCode } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <aside className="relative hidden overflow-hidden bg-navy p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border-[48px] border-navy-2" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full border-[36px] border-[#17233b]" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-lg font-bold">C</span>
          <span className="text-xl font-bold">CareTwin AI</span>
        </Link>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">Every record. Every family member. One place.</h2>
          <ul className="mt-8 space-y-4 text-[#b9c4d8]">
            {[
              [Users, "Keep records for the whole family"],
              [QrCode, "Share emergency details with one scan"],
              [ShieldCheck, "Your data stays under your control"],
            ].map(([Icon, text]) => {
              const I = Icon as typeof Users;
              return (
                <li key={text as string} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-mint"><I size={18} /></span>
                  {text as string}
                </li>
              );
            })}
          </ul>
        </div>
        <p className="relative text-sm text-[#8f9bb3]">&copy; 2026 CareTwin AI</p>
      </aside>

      <main className="flex items-center justify-center bg-slate-50 px-5 py-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-lg font-bold text-white">C</span>
            <span className="text-xl font-bold text-ink">CareTwin AI</span>
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}

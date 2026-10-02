import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 text-center">
      <p className="text-7xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">We couldn&apos;t find that page</h1>
      <p className="mt-2 max-w-sm text-body">The link may be old or mistyped. Head back and try again.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Go home</Link>
        <Link href="/dashboard" className="rounded-lg border border-[#dfe3ea] bg-white px-5 py-2.5 text-sm font-semibold text-body hover:bg-slate-50">Open dashboard</Link>
      </div>
    </main>
  );
}

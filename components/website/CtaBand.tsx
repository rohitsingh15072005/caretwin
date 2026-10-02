import Link from "next/link";
import { Reveal } from "@/components/ui/Motion";

export default function CtaBand() {
  return (
    <section className="px-5 pb-6 sm:px-8">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-navy px-6 py-14 text-center text-white sm:px-12">
        <div aria-hidden className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full border-[30px] border-navy-2" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-10 h-56 w-56 rounded-full border-[26px] border-[#17233b]" />
        <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">Start your family&apos;s Health Twin today</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-[#b9c4d8]">Create a free account and add your first record in under a minute.</p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup" className="rounded-xl bg-mint px-8 py-3.5 font-semibold text-mint-deep transition hover:bg-[#5be98f] active:scale-[0.98]">Create account</Link>
          <Link href="/company/Contact" className="rounded-xl border border-white/30 px-8 py-3.5 font-semibold transition hover:bg-white/10">Talk to us</Link>
        </div>
      </Reveal>
    </section>
  );
}

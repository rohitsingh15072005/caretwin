"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/Platform/Features", label: "Features" },
  { href: "/company/About", label: "About" },
  { href: "/Legal/Faqs", label: "FAQs" },
  { href: "/company/Contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-lg font-bold text-white">C</span>
            <span className="text-xl font-bold text-ink">CareTwin <span className="text-brand">AI</span></span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${active ? "text-brand" : "text-body hover:text-brand"}`}
                  >
                    {l.label}
                    {active && <motion.span layoutId="site-nav" className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-brand" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-body transition hover:text-brand">
            Sign in
          </Link>
          <Link href="/signup" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98]">
            Join now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-100 bg-white md:hidden">
            <ul className="space-y-1 px-5 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setOpen(false)} className={`block rounded-lg px-3 py-3 text-base font-medium ${pathname === l.href ? "bg-brand-soft text-brand" : "text-body"}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="grid grid-cols-2 gap-3 pt-3">
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg border border-brand py-3 text-center text-sm font-semibold text-brand">
                  Sign in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-lg bg-brand py-3 text-center text-sm font-semibold text-white">
                  Join now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

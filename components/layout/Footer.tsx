import Link from "next/link";
import { SITE } from "@/lib/site";

const columns = [
  {
    title: "Platform",
    links: [
      { href: "/Platform/Features", label: "Features" },
      { href: "/Platform/AI_Diagnostics", label: "AI Diagnostics" },
      { href: "/Platform/Integrations", label: "Integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company/About", label: "About us" },
      { href: "/company/Contact", label: "Contact" },
      { href: "/Legal/Faqs", label: "FAQs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/Legal/Privacy_Policy", label: "Privacy Policy" },
      { href: "/Legal/Terms_of_Service", label: "Terms of Service" },
      { href: "/Legal/HIPAA_Compliance", label: "HIPAA Compliance" },
      { href: "/Legal/Security", label: "Security" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-lavender py-12 text-slate-800">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-10 border-b border-slate-300/50 pb-8 lg:flex-row">
          <div className="max-w-md">
            <p className="mb-2 text-2xl font-bold text-brand">{SITE.name}</p>
            <p className="text-sm leading-relaxed text-slate-700">
              Human-centric healthcare intelligence for a longer and healthier life. Built with care and precision, CareTwin AI is your companion on the journey to better health.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 lg:gap-14">
            {columns.map((c) => (
              <div key={c.title} className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-slate-900">{c.title}</h2>
                {c.links.map((l) => (
                  <Link key={l.href} href={l.href} className="text-slate-700 transition duration-200 hover:text-brand">
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="pt-6 text-sm text-slate-600">&copy; {SITE.year} {SITE.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

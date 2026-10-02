import Link from "next/link";
import { SITE } from "@/lib/site";

const links = [
  { href: "/Legal/Privacy_Policy", label: "Privacy Policy" },
  { href: "/Legal/Terms_of_Service", label: "Terms of Service" },
  { href: "/Legal/HIPAA_Compliance", label: "HIPAA Compliance" },
  { href: "/dashboard/support", label: "Contact" },
];

export default function DashboardFooter() {
  return (
    <footer className="border-t border-line bg-lavender px-4 py-5 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-brand">{SITE.name}</p>
          <p className="mt-0.5 text-xs text-mute">© {SITE.year} {SITE.name}. Human-centric intelligence.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-xs text-body transition hover:text-brand">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

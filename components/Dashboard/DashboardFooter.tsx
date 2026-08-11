import Link from "next/link";

export default function DashboardFooter() {
  return (
    <footer className="border-t border-[#e5e7eb] bg-[#DBDFFF] px-8 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Left */}
        <div>
          <p className="text-[12px] font-bold text-[#0878b8]">
            CareTwin AI
          </p>

          <p className="mt-1 text-[9px] text-[#9ca3af]">
            © 2026 CareTwin AI · Human-Centric Intelligence.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href="/privacy"
            className="text-[9px] text-[#6b7280] transition hover:text-[#0878b8]"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="text-[9px] text-[#6b7280] transition hover:text-[#0878b8]"
          >
            Terms of Service
          </Link>

          <Link
            href="/hipaa"
            className="text-[9px] text-[#6b7280] transition hover:text-[#0878b8]"
          >
            HIPAA Compliance
          </Link>

          <Link
            href="/contact"
            className="text-[9px] text-[#6b7280] transition hover:text-[#0878b8]"
          >
            Contact
          </Link>
        </div>

      </div>
    </footer>
  );
}
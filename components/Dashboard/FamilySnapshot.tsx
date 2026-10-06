import Link from "next/link";
import { Users } from "lucide-react";

export default function FamilySnapshot() {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <Users size={18} />
        </span>
        <h2 className="text-[15px] font-bold text-ink">Family profiles</h2>
      </div>
      <p className="mt-3 text-[13px] leading-5 text-mute">
        Family profiles are not available from the connected CareTwin API yet. This dashboard shows only your own account data.
      </p>
      <Link href="/dashboard/family" className="mt-3 inline-block text-[13px] font-semibold text-brand hover:text-brand-dark">
        Learn more
      </Link>
    </section>
  );
}

import Link from "next/link";
import { Users } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function FamilyPage() {
  return (
    <div className="mx-auto w-full max-w-[1000px] space-y-5">
      <PageHeader
        icon={<Users size={22} />}
        title="Family profiles"
        subtitle="Family profiles are not currently supported by the connected CareTwin API."
      />
      <section className="rounded-xl border border-dashed border-[#cfd7e6] bg-white px-6 py-12 text-center">
        <Users size={32} className="mx-auto text-[#c3cbda]" />
        <h2 className="mt-3 text-sm font-semibold text-ink">No family profiles are connected</h2>
        <p className="mx-auto mt-1 max-w-md text-[13px] leading-5 text-mute">
          Only your own account and medical records are available here. Family members will appear when the backend supports family profiles.
        </p>
        <Link href="/dashboard/profile" className="mt-4 inline-flex text-sm font-semibold text-brand hover:text-brand-dark">
          View your profile
        </Link>
      </section>
    </div>
  );
}

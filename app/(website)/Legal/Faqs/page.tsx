import PageHero from "@/components/website/PageHero";
import FaqList from "@/components/shared/FaqList";
import CtaBand from "@/components/website/CtaBand";
import { FAQS } from "@/lib/faqs";

export const metadata = { title: "FAQs" };

export default function FaqsPage() {
  return (
    <>
      <PageHero title="Frequently asked questions" subtitle="Quick answers about records, family profiles, AI guidance and privacy." />
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <FaqList items={FAQS} />
      </div>
      <CtaBand />
    </>
  );
}

import PageHero from "@/components/website/PageHero";
import ContactSection from "@/components/shared/ContactSection";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact us" subtitle="Questions about CareTwin AI, your records or the platform? Send us a message." />
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        <ContactSection />
      </div>
    </>
  );
}

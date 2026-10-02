import LegalPage from "@/components/website/LegalPage";

export const metadata = { title: "HIPAA Compliance" };

export default function HipaaPage() {
  return (
    <LegalPage
      title="HIPAA Compliance"
      updated="1 October 2026"
      intro="How CareTwin AI approaches the protection of health information."
      sections={[
        { id: "about", heading: "About HIPAA", body: ["The Health Insurance Portability and Accountability Act (HIPAA) is a United States law that sets rules for how covered healthcare organisations and their business associates protect health information."] },
        { id: "approach", heading: "Our approach", body: ["CareTwin AI is designed around the same principles that HIPAA is built on:"], items: ["Collect the minimum health information needed", "Give you control over what is stored and shared", "Protect information from unauthorised access", "Be open about how information is used"] },
        { id: "status", heading: "Current status", body: ["CareTwin AI does not currently claim formal HIPAA certification. Before we process health information for covered entities, we will complete the required safeguards and agreements, and describe them here."] },
        { id: "yours", heading: "Your responsibilities", body: ["If you use CareTwin AI on behalf of a healthcare organisation, check with your compliance team before adding patient information."] },
      ]}
    />
  );
}

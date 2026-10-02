import LegalPage from "@/components/website/LegalPage";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="1 October 2026"
      intro="Your health information is personal. This page explains what CareTwin AI collects, why, and the control you have over it."
      sections={[
        { id: "collect", heading: "What we collect", body: ["We collect only what is needed to run the service:"], items: ["Account details such as your name and email address", "Health information you add, such as records, profile details and family members", "Basic technical data such as browser type, used to keep the app working"] },
        { id: "use", heading: "How we use it", body: ["We use your information to show your records, generate summaries and emergency cards, and provide AI guidance you ask for. We do not sell your personal or health information."] },
        { id: "storage", heading: "Where it is stored", body: ["In the current version, your records are stored in your own browser on your device. When cloud sync is introduced, we will update this policy and ask for your consent before moving any data."] },
        { id: "sharing", heading: "Sharing", body: ["We share information only when you ask us to (for example by sharing an emergency QR code) or when the law requires it. Anyone who scans an emergency QR code can read the fields you chose to include."] },
        { id: "rights", heading: "Your choices", body: ["You can edit your information at any time, export a copy, or erase everything from Settings, under Health Data & Privacy."] },
        { id: "children", heading: "Children and family members", body: ["You may add family members, including children, to keep their records. You confirm you are authorised to manage their health information."] },
        { id: "contact", heading: "Contact", body: ["Questions about privacy? Reach us through the Contact page and we will reply as soon as we can."] },
      ]}
    />
  );
}

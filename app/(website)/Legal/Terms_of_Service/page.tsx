import LegalPage from "@/components/website/LegalPage";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="1 October 2026"
      intro="By using CareTwin AI you agree to these terms. Please read them carefully."
      sections={[
        { id: "service", heading: "The service", body: ["CareTwin AI helps you organise health records, understand them and share emergency details. It is an information tool, not a medical provider."] },
        { id: "medical", heading: "Not medical advice", body: ["Nothing in CareTwin AI is a diagnosis or treatment. AI-generated content can be wrong or incomplete. Always consult a qualified healthcare professional, and call your local emergency number in an emergency."] },
        { id: "account", heading: "Your account", body: ["You are responsible for the information you add and for keeping your login details safe. Provide accurate details and only add records for people you are authorised to manage."] },
        { id: "use", heading: "Acceptable use", body: ["Do not misuse the service. This includes:"], items: ["Uploading content you have no right to share", "Attempting to access other people's data", "Interfering with the service or its security"] },
        { id: "qr", heading: "Emergency QR codes", body: ["An emergency QR code makes the information you choose readable by anyone who scans it. You decide what to include and you are responsible for sharing it."] },
        { id: "liability", heading: "Liability", body: ["To the extent permitted by law, CareTwin AI is provided as is and is not liable for decisions made based on its content."] },
        { id: "changes", heading: "Changes", body: ["We may update these terms. When we do, we will change the date at the top of this page."] },
      ]}
    />
  );
}

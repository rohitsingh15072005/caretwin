import LegalPage from "@/components/website/LegalPage";

export const metadata = { title: "Security" };

export default function SecurityPage() {
  return (
    <LegalPage
      title="Security"
      updated="1 October 2026"
      intro="Practical steps we take, and steps you can take, to keep health information safe."
      sections={[
        { id: "design", heading: "Security by design", body: ["Your records are currently stored locally in your browser rather than on a shared server, which keeps them out of reach of other users of the service."] },
        { id: "control", heading: "Controls you have", body: ["From Settings you can:"], items: ["Export a copy of your data", "Erase all data stored on the device", "Control whether the AI may use your records"] },
        { id: "qr", heading: "Emergency QR codes", body: ["QR codes contain the details you select, inside the code or link itself. Treat a printed card like a document: share it only with people you trust, and create a new code if your details change."] },
        { id: "tips", heading: "Staying safe", body: ["We recommend that you:"], items: ["Use a strong, unique password", "Sign out on shared devices", "Keep your device and browser up to date"] },
        { id: "report", heading: "Report a vulnerability", body: ["If you find a security problem, please tell us through the Contact page so we can investigate quickly."] },
      ]}
    />
  );
}

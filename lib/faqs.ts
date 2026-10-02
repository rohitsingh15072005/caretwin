export interface Faq {
  q: string;
  a: string;
  topic: "Getting started" | "Account & security" | "AI tools" | "Health records";
}

export const FAQS: Faq[] = [
  { topic: "Getting started", q: "What is CareTwin AI?", a: "CareTwin AI is a personal health workspace. You keep medical records for yourself and your family in one place, ask the AI assistant questions about them, check symptoms, and create an emergency QR card." },
  { topic: "Getting started", q: "How do I add a family member?", a: "Open Family in the sidebar and choose Add member. Enter their details, then upload their reports from Medical Records and pick their name. You can switch between members from the top bar at any time." },
  { topic: "Health records", q: "What file types can I upload?", a: "PDF reports and common image formats (JPG, PNG) work best. You add a title, date and doctor so the record is easy to find on the timeline." },
  { topic: "Health records", q: "How does the report summary work?", a: "Choose a family member and a period, such as the past 4 or 6 months. CareTwin gathers the records in that period and writes a short summary of what changed, what needs attention and which follow-ups are open." },
  { topic: "Health records", q: "Can I see only the last few months of records?", a: "Yes. On Medical Records use the period selector (1, 3, 4, 6 or 12 months, or a custom range) and switch to the timeline view to see them month by month." },
  { topic: "AI tools", q: "Is the AI a replacement for a doctor?", a: "No. The AI explains your records and gives general guidance. It cannot diagnose or treat you. If you feel unwell or unsure, see a qualified clinician." },
  { topic: "AI tools", q: "What should I do in an emergency?", a: "Call your local emergency number (112 in India) first. Show your Emergency QR card so responders can see your blood group, allergies and contacts." },
  { topic: "Account & security", q: "Where is my data stored?", a: "In this version your data is stored in your own browser on this device. Nothing is sent to a server until the cloud backend is connected. You can export or erase it any time in Settings." },
  { topic: "Account & security", q: "What is on the emergency QR code?", a: "Only the fields you tick: for example blood group, allergies and an emergency contact. The details are inside the code or the link itself. Anyone who scans it can read them, so leave out anything private." },
  { topic: "Account & security", q: "How do I delete my data?", a: "Go to Settings, then Health Data & Privacy, and choose Erase all data. This removes every record and member stored on this device." },
];

export const TOPICS = ["Getting started", "Account & security", "AI tools", "Health records"] as const;

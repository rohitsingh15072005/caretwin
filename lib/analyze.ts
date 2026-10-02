// Demo symptom analysis. Rule based and runs in the browser.
// Replace `analyzeSymptoms` with a call to your AI backend when it exists.

export interface Analysis {
  urgency: "emergency" | "soon" | "routine";
  summary: string;
  possible: { name: string; likelihood: "More likely" | "Possible" | "Less likely"; note: string }[];
  specialty: string;
  advice: string[];
}

export const COMMON_SYMPTOMS = [
  "Headache",
  "Fever",
  "Cough",
  "Fatigue",
  "Nausea",
  "Sore throat",
  "Chest pain",
  "Shortness of breath",
  "Dizziness",
  "Stomach pain",
  "Body ache",
  "Runny nose",
];

const EMERGENCY = ["chest pain", "shortness of breath", "difficulty breathing", "fainting", "confusion", "slurred speech", "severe bleeding"];

const has = (list: string[], ...terms: string[]) =>
  terms.some((t) => list.some((s) => s.includes(t)));

export function analyzeSymptoms(symptoms: string[]): Analysis {
  const s = symptoms.map((x) => x.toLowerCase());

  if (EMERGENCY.some((e) => has(s, e))) {
    return {
      urgency: "emergency",
      summary: "One or more of these symptoms can signal a serious problem that should not wait.",
      possible: [
        { name: "Heart or lung problem", likelihood: "Possible", note: "Chest and breathing symptoms need urgent assessment." },
      ],
      specialty: "Emergency medicine",
      advice: [
        "Call your local emergency number now or go to the nearest emergency department.",
        "Do not drive yourself. Ask someone to take you or call an ambulance.",
        "Show your Emergency QR card to the responders.",
      ],
    };
  }

  const possible: Analysis["possible"] = [];
  let specialty = "General physician";

  if (has(s, "fever") && has(s, "cough", "sore throat", "runny nose", "body ache")) {
    possible.push({ name: "Viral respiratory infection (flu or cold)", likelihood: "More likely", note: "Fever with cough, throat or nasal symptoms is the typical pattern." });
    possible.push({ name: "Throat or chest infection", likelihood: "Possible", note: "More likely if symptoms last longer than a week." });
    specialty = "General physician";
  } else if (has(s, "headache") && has(s, "nausea", "dizziness")) {
    possible.push({ name: "Migraine", likelihood: "More likely", note: "Headache with nausea or dizziness often points to migraine." });
    possible.push({ name: "Dehydration or low blood sugar", likelihood: "Possible", note: "Worth checking if you skipped meals or drank little water." });
    specialty = "General physician or neurologist";
  } else if (has(s, "stomach", "nausea")) {
    possible.push({ name: "Gastroenteritis or food-related upset", likelihood: "More likely", note: "Common after a recent change in food or water." });
    possible.push({ name: "Acidity or gastritis", likelihood: "Possible", note: "Often linked to irregular meals or spicy food." });
    specialty = "General physician or gastroenterologist";
  } else if (has(s, "fatigue")) {
    possible.push({ name: "Poor sleep or stress", likelihood: "More likely", note: "The most frequent cause of ongoing tiredness." });
    possible.push({ name: "Anaemia or vitamin deficiency", likelihood: "Possible", note: "A blood test can check this." });
    possible.push({ name: "Thyroid imbalance", likelihood: "Less likely", note: "Consider if tiredness lasts for weeks." });
  } else {
    possible.push({ name: "Minor, short-lived illness", likelihood: "More likely", note: "Many single symptoms settle within a few days." });
    possible.push({ name: "Needs a clinician's opinion", likelihood: "Possible", note: "Add more symptoms for a better guide." });
  }

  const soon = s.length >= 4 || has(s, "fever") && s.length >= 3;
  return {
    urgency: soon ? "soon" : "routine",
    summary: soon
      ? "Several symptoms together. A check-up within a day or two is a sensible step."
      : "These symptoms are usually mild. Monitor them and rest.",
    possible,
    specialty,
    advice: [
      "Rest, drink plenty of fluids and eat light meals.",
      "Note when the symptoms started and how they change.",
      "See a doctor if symptoms get worse, last more than 3 days, or you develop a high fever or trouble breathing.",
    ],
  };
}

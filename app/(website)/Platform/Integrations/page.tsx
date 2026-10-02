import { Watch, FlaskConical, Building2, CalendarDays, Smartphone, Share2 } from "lucide-react";
import PageHero from "@/components/website/PageHero";
import CtaBand from "@/components/website/CtaBand";
import { Reveal } from "@/components/ui/Motion";

export const metadata = { title: "Integrations" };

const items = [
  { icon: Watch, name: "Wearables", text: "Bring heart rate, sleep and activity from your smartwatch or fitness band into your Health Twin." },
  { icon: FlaskConical, name: "Diagnostic labs", text: "Receive lab reports automatically, already organised by date and type." },
  { icon: Building2, name: "Hospitals and clinics", text: "Let your doctor's office share visit summaries and prescriptions with you." },
  { icon: CalendarDays, name: "Calendars", text: "Add follow-ups and check-ups to the calendar you already use." },
  { icon: Smartphone, name: "Phone health apps", text: "Sync steps and vitals from the health app on your phone." },
  { icon: Share2, name: "Secure sharing", text: "Send a time-limited summary to a doctor without sharing your login." },
];

export default function IntegrationsPage() {
  return (
    <>
      <PageHero title="Integrations" subtitle="CareTwin is designed to connect the places your health data already lives. These connections are on our roadmap." />
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((i) => (
              <li key={i.name} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700"><i.icon size={22} /></span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Planned</span>
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-900">{i.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{i.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
      <CtaBand />
    </>
  );
}

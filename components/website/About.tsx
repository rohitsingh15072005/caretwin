import Image from "next/image";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Motion";

const points = [
  { title: "Trust-first policy", text: "We never sell your data. You hold the keys to your digital twin." },
  { title: "Evidence-based AI", text: "Guidance is grounded in published clinical knowledge and designed to be reviewed by healthcare professionals." },
];

export default function About() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Image src="/images/Human_Centric.png" alt="Doctors discussing AI healthcare" width={1635} height={962} sizes="(min-width: 1024px) 560px, 100vw" className="h-auto w-full rounded-3xl object-cover shadow-lg" />
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">Human-centric intelligence</h2>
            <p className="mt-7 text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              At CareTwin AI, we believe technology should amplify humanity, not replace it. Our mission is to bridge the gap between cold data and clinical care, with tools that empower patients and clinicians alike.
            </p>
            <ul className="mt-10 space-y-7">
              {points.map((p) => (
                <li key={p.title} className="flex gap-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white"><Check size={20} /></span>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 sm:text-2xl">{p.title}</h3>
                    <p className="mt-1.5 text-slate-500">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

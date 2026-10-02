import { Reveal } from "@/components/ui/Motion";

export default function PageHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="bg-[#E9EDFF] px-5 py-14 text-center sm:px-8 sm:py-20">
      <Reveal className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{subtitle}</p>
      </Reveal>
    </section>
  );
}

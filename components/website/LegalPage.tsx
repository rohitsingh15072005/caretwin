import PageHero from "./PageHero";

export interface LegalSection {
  id: string;
  heading: string;
  body: string[];
  items?: string[];
}

export default function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero title={title} subtitle={intro} />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[220px_1fr] lg:gap-16">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-sm font-semibold text-slate-900">On this page</p>
            <ul className="mt-3 space-y-2 border-l border-slate-200">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent pl-4 text-sm text-slate-600 transition hover:border-brand hover:text-brand">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <article className="min-w-0 max-w-3xl">
          <p className="text-sm text-slate-500">Last updated: {updated}</p>
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 pt-9">
              <h2 className="text-2xl font-bold text-slate-900">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 leading-7 text-slate-600">{p}</p>
              ))}
              {s.items && (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-7 text-slate-600">
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TallyForm from "@/components/TallyForm";
import { PageHeader } from "@/components/ui";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = (await getDictionary(lang)).meta.book;
  return { title: m.title, description: m.description };
}

export default async function BookPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const all = await getDictionary(lang);
  const dict = all.book;

  return (
    <>
      <PageHeader
        eyebrow={dict.header.eyebrow}
        titleHtml={dict.header.title}
        subHtml={dict.header.sub}
        bg="https://images.unsplash.com/photo-1609521247503-8de40462e427?w=2400&q=80"
        minHeight="50vh"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 1080 }}>
          <TallyForm
            src="https://tally.so/embed/wgb1bP?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            title="Request transportation"
          />
        </div>
      </section>

      <section className="container reveal" style={{ paddingBottom: "var(--space-xl)" }}>
        <div className="promise-strip reveal-stagger">
          {dict.promise.map((p) => (
            <div key={p.title} className="promise-item">
              <img className="icon" src={`/assets/icons/${p.icon}`} alt="" />
              <h5>{p.title}</h5>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaStrip, Eyebrow, PageHeader, RichText, RuleGold } from "@/components/ui";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = (await getDictionary(lang)).meta.locations;
  return { title: m.title, description: m.description };
}

type LocCard = { id: string; img: string; tag: string; title: string; body: string; fromK: string; fromV: string };

function LocCardEl({ c, bookHref, quoteLabel }: { c: LocCard; bookHref: string; quoteLabel: string }) {
  return (
    <article className="loc-card" id={c.id}>
      <div className="img-wrap"><img src={c.img} alt="" /></div>
      <div className="body">
        <span className="eyebrow-sm">{c.tag}</span>
        <h4>{c.title}</h4>
        <p>{c.body}</p>
        <div className="from"><span className="k">{c.fromK}</span><span className="v">{c.fromV}</span></div>
        <a className="loc-quote" href={bookHref}>
          {quoteLabel}
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 24h36" />
            <path d="M32 14l10 10-10 10" />
          </svg>
        </a>
      </div>
    </article>
  );
}

export default async function LocationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang)).locations;
  const L = (p: string) => `/${lang}${p}`;
  const bookHref = L("/book");

  return (
    <>
      <PageHeader
        eyebrow={dict.header.eyebrow}
        titleHtml={dict.header.title}
        subHtml={dict.header.sub}
        bg="/uploads/site/sea-transfer.jpg"
      />

      <section className="section reveal">
        <div className="container">
          <div className="section-header">
            <div>
              <Eyebrow>{dict.ports.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.ports.title} />
            </div>
            <p className="lead right">{dict.ports.lead}</p>
          </div>
          <div className="loc-grid reveal-stagger" style={{ marginTop: "var(--space-lg)" }}>
            {(dict.ports.items as LocCard[]).map((c) => <LocCardEl key={c.id} c={c} bookHref={bookHref} quoteLabel={dict.quoteLabel} />)}
          </div>
        </div>
      </section>

      <section className="section alt reveal">
        <div className="container">
          <div className="section-header">
            <div>
              <Eyebrow>{dict.beaches.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.beaches.title} />
            </div>
            <p className="lead right">{dict.beaches.lead}</p>
          </div>
          <div className="loc-grid reveal-stagger" style={{ marginTop: "var(--space-lg)" }}>
            {(dict.beaches.items as LocCard[]).map((c) => <LocCardEl key={c.id} c={c} bookHref={bookHref} quoteLabel={dict.quoteLabel} />)}
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="container">
          <div className="section-header">
            <div>
              <Eyebrow>{dict.landmarks.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.landmarks.title} />
            </div>
            <p className="lead right">{dict.landmarks.lead}</p>
          </div>
          <div className="loc-grid reveal-stagger" style={{ marginTop: "var(--space-lg)" }}>
            {(dict.landmarks.items as LocCard[]).map((c) => <LocCardEl key={c.id} c={c} bookHref={bookHref} quoteLabel={dict.quoteLabel} />)}
          </div>
        </div>
      </section>

      <section className="section alt reveal" id="villas">
        <div className="container">
          <div className="section-header">
            <div>
              <Eyebrow>{dict.villas.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.villas.title} />
            </div>
            <p className="lead right">{dict.villas.lead}</p>
          </div>
          <div className="locations-list reveal-stagger">
            {dict.villas.items.map((v) => (
              <a key={v.name} className="location-row" href="#">
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span className="name">{v.name}</span>
                  <span className="meta">{v.meta}</span>
                </div>
                <img className="arrow" src="/assets/icons/icon-arrow-right.svg" alt="" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow={dict.cta.eyebrow}
        titleHtml={dict.cta.title}
        primary={{ label: dict.cta.primary, href: L("/book") }}
        secondary={{ label: dict.cta.secondary, href: L("/contact") }}
      />
    </>
  );
}

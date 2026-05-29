import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaStrip, Eyebrow, PageHeader, RichText, RuleGold } from "@/components/ui";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = (await getDictionary(lang)).meta.services;
  return { title: m.title, description: m.description };
}

type Detail = {
  id: string;
  number: string;
  title: string;
  intro: string;
  bullets: string[];
  ctaLabel: string;
  ctaPath: string;
  readMorePath: string;
  img: string;
  imgFirst?: boolean;
  alt?: boolean;
};

function DetailRow({ d, lang, readMoreLabel }: { d: Detail; lang: string; readMoreLabel: string }) {
  const L = (p: string) => `/${lang}${p}`;
  const body = (
    <div className="fleet-row-text">
      <span className="eyebrow-sm">{d.number}</span>
      <h3>{d.title}</h3>
      <RichText as="p" html={d.intro} />
      <div className="prose-block">
        <ul>
          {d.bullets.map((b) => (<li key={b}>{b}</li>))}
        </ul>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md, 24px)", flexWrap: "wrap" }}>
        <Link className="btn btn-primary" href={L(d.ctaPath)}>{d.ctaLabel}</Link>
        <Link className="link-luxe" href={L(d.readMorePath)}>{readMoreLabel} <span>→</span></Link>
      </div>
    </div>
  );
  const img = <div className="fleet-row-img"><img src={d.img} alt="" /></div>;
  return (
    <section className={`section reveal${d.alt ? " alt" : ""}`} id={d.id}>
      <div className="container">
        <div className="fleet-row" style={{ borderTop: 0, paddingTop: 0 }}>
          {d.imgFirst ? <>{img}{body}</> : <>{body}{img}</>}
        </div>
      </div>
    </section>
  );
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang)).services;
  const L = (p: string) => `/${lang}${p}`;

  return (
    <>
      <PageHeader
        eyebrow={dict.header.eyebrow}
        titleHtml={dict.header.title}
        subHtml={dict.header.sub}
        bg="https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=2400&q=80"
      />

      <section className="section reveal">
        <div className="container">
          <div className="section-header">
            <div>
              <Eyebrow>{dict.overview.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.overview.title} />
            </div>
            <p className="lead right">{dict.overview.lead}</p>
          </div>

          <div className="services-grid reveal-stagger" style={{ marginTop: "var(--space-lg)" }}>
            {dict.overview.items.map((s) => (
              <Link key={s.id} className="service-tile" href={L(s.path)}>
                <img className="icon" src={`/assets/icons/${s.icon}`} alt="" />
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <span className="link-luxe">{dict.readMore} <span>→</span></span>
              </Link>
            ))}
            <Link className="service-tile" href={L("/fleet")}>
              <img className="icon" src="/assets/icons/icon-van.svg" alt="" />
              <h3>{dict.overview.fleetTile.title}</h3>
              <p>{dict.overview.fleetTile.body}</p>
              <span className="link-luxe">{dict.overview.fleetTile.cta} <span>→</span></span>
            </Link>
          </div>
        </div>
      </section>

      {(dict.details as Detail[]).map((d) => (
        <DetailRow key={d.id} d={d} lang={lang} readMoreLabel={dict.readMore} />
      ))}

      <CtaStrip
        eyebrow={dict.cta.eyebrow}
        titleHtml={dict.cta.title}
        primary={{ label: dict.cta.primary, href: L("/book") }}
        secondary={{ label: dict.cta.secondaryPhone, href: "tel:+306973564477" }}
      />
    </>
  );
}

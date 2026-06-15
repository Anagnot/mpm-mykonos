import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaStrip, Eyebrow, PageHeader, RichText, RuleGold } from "@/components/ui";
import FleetGallery from "@/components/FleetGallery";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = (await getDictionary(lang)).meta.fleet;
  return { title: m.title, description: m.description };
}

type Card = { id: string; img: string; badge: string; name: string; specs: Array<[string | null, string]> };
type Row = { id: string; tag: string; title: string; body: string; specs: Array<[string, string]>; img: string };

// Extra photos per vehicle (not translatable, so kept out of the dictionaries).
// The row's lead image is shown large above; these fill the gallery beneath it.
const FLEET_GALLERY: Record<string, string[]> = {
  vito: [
    "/uploads/fleet/vito.jpg",
    "/uploads/fleet/vito-boot.jpg",
    "/uploads/fleet/vito-exterior-2.jpg",
  ],
  sprinter: [
    "/uploads/fleet/sprinter.jpg",
    "/uploads/fleet/sprinter-scenic.jpg",
    "/uploads/fleet/sprinter-interior-blue.jpg",
    "/uploads/fleet/sprinter-interior-tan.jpg",
    "/uploads/fleet/sprinter-night.jpg",
    "/uploads/fleet/sprinter-mykonos.jpg",
  ],
};

function FleetRow({ row, gallery }: { row: Row; gallery?: string[] }) {
  return (
    <div className="fleet-row" id={row.id}>
      <div className="fleet-row-text">
        <span className="eyebrow-sm">{row.tag}</span>
        <h3>{row.title}</h3>
        <p>{row.body}</p>
        <div className="spec-grid">
          {row.specs.map(([k, v]) => (
            <div key={k}><span className="k">{k}</span><span className="v">{v}</span></div>
          ))}
        </div>
      </div>
      <div className="fleet-row-img"><img src={row.img} alt="" /></div>
      {gallery && gallery.length > 0 && (
        <FleetGallery images={gallery} label={row.title} />
      )}
    </div>
  );
}

export default async function FleetPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang)).fleet;
  const L = (p: string) => `/${lang}${p}`;

  return (
    <>
      <PageHeader
        eyebrow={dict.header.eyebrow}
        titleHtml={dict.header.title}
        subHtml={dict.header.sub}
        bg="/uploads/site/chauffeur-door.jpg"
      />

      <section className="section reveal">
        <div className="container">
          <div className="section-header">
            <div>
              <Eyebrow>{dict.category.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.category.title} />
            </div>
            <p className="lead right">{dict.category.lead}</p>
          </div>
          <div className="fleet-grid two-up reveal-stagger">
            {(dict.cards as Card[]).map((c) => (
              <Link key={c.id} className="fleet-card" href={`#${c.id}`}>
                <div className="img-wrap">
                  <img src={c.img} alt="" />
                  <span className="badge">{c.badge}</span>
                </div>
                <div className="meta">
                  <span className="eyebrow-sm">{c.badge}</span>
                  <h4>{c.name}</h4>
                  <div className="specs">
                    {c.specs.map(([num, label], i) => (
                      <span key={i}>{num ? <><b>{num}</b> {label}</> : label}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt reveal">
        <div className="container">
          <RichText as="h2" className="title-h2" html={dict.carsTitle} style={{ marginBottom: "var(--space-md)" }} />
          {(dict.carRows as Row[]).map((r) => <FleetRow key={r.id} row={r} gallery={FLEET_GALLERY[r.id]} />)}
        </div>
      </section>

      <section className="section reveal">
        <div className="container">
          <div className="section-header center">
            <Eyebrow>{dict.standards.eyebrow}</Eyebrow>
            <RuleGold center />
            <RichText as="h2" className="title-h2" html={dict.standards.title} style={{ textAlign: "center" }} />
            <p className="lead" style={{ textAlign: "center", margin: "0 auto" }}>{dict.standards.lead}</p>
          </div>
          <div className="promise-strip reveal-stagger" style={{ marginTop: "var(--space-lg)" }}>
            {dict.standards.items.map((it) => (
              <div key={it.title} className="promise-item">
                <img className="icon" src={`/assets/icons/${it.icon}`} alt="" />
                <h5>{it.title}</h5>
                <p>{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt reveal">
        <div className="container">
          <RichText as="h2" className="title-h2" html={dict.airSeaTitle} style={{ marginBottom: "var(--space-md)" }} />
          {(dict.airSeaRows as Row[]).map((r) => <FleetRow key={r.id} row={r} />)}
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

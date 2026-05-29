import { CtaStrip, Eyebrow, PageHeader, RichText, RuleGold } from "@/components/ui";
import Link from "next/link";

export type ServiceHeader = { eyebrow: string; title: string; sub: string };
export type ServiceIntro = { eyebrow: string; title: string; lead: string };
export type ServiceRow1 = {
  eyebrowSm: string;
  title: string;
  body: string;
  img: string;
  alt: string;
  cta: string;
  ctaPath: string;
};
export type ServiceTilesSection = { eyebrow: string; title: string; lead: string };
export type ServiceTile = { icon?: string; tag?: string; title: string; body: string };
export type ServiceRow2 = {
  eyebrowSm: string;
  title: string;
  p1: string;
  p2: string;
  img: string;
  alt: string;
};
export type ServiceCta = { eyebrow: string; title: string; primary: string; primaryPath: string };

export default function ServiceDetailLayout({
  lang,
  bg,
  header,
  intro,
  row1,
  bullets,
  tilesSection,
  tiles,
  row2,
  cta,
  ctaSecondary,
  tilesAfterRow2 = false,
}: {
  lang: string;
  bg: string;
  header: ServiceHeader;
  intro: ServiceIntro;
  row1: ServiceRow1;
  bullets: string[];
  tilesSection: ServiceTilesSection;
  tiles: ServiceTile[];
  row2: ServiceRow2;
  cta: ServiceCta;
  ctaSecondary?: { label: string; href: string };
  tilesAfterRow2?: boolean;
}) {
  const L = (p: string) => `/${lang}${p}`;

  const Row1Section = (
    <section className="section alt reveal">
      <div className="container">
        <div className="fleet-row" style={{ borderTop: 0, paddingTop: 0 }}>
          <div className="fleet-row-text">
            <span className="eyebrow-sm">{row1.eyebrowSm}</span>
            <h3>{row1.title}</h3>
            <p>{row1.body}</p>
            <div className="prose-block">
              <ul>
                {bullets.map((b) => (<li key={b}>{b}</li>))}
              </ul>
            </div>
            <div>
              <Link className="btn btn-primary" href={L(row1.ctaPath)}>{row1.cta}</Link>
            </div>
          </div>
          <div className="fleet-row-img"><img src={row1.img} alt={row1.alt} /></div>
        </div>
      </div>
    </section>
  );

  const TilesBlock = (
    <section className="section reveal">
      <div className="container">
        <div className="section-header">
          <div>
            <Eyebrow>{tilesSection.eyebrow}</Eyebrow>
            <RuleGold />
            <RichText as="h2" className="title-h2" html={tilesSection.title} />
          </div>
          <p className="lead right">{tilesSection.lead}</p>
        </div>
        <div className="services-grid reveal-stagger" style={{ marginTop: "var(--space-lg)" }}>
          {tiles.map((t) => (
            <div key={t.title} className="service-tile">
              {t.icon && <img className="icon" src={`/assets/icons/${t.icon}`} alt="" />}
              {t.tag && <span className="eyebrow-sm">{t.tag}</span>}
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Row2Section = (
    <section className={`section${tilesAfterRow2 ? "" : " alt"} reveal`}>
      <div className="container">
        <div className="fleet-row" style={{ borderTop: 0, paddingTop: 0 }}>
          <div className="fleet-row-img"><img src={row2.img} alt={row2.alt} /></div>
          <div className="fleet-row-text">
            <span className="eyebrow-sm">{row2.eyebrowSm}</span>
            <h3>{row2.title}</h3>
            <p>{row2.p1}</p>
            <p>{row2.p2}</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <PageHeader
        eyebrow={header.eyebrow}
        titleHtml={header.title}
        subHtml={header.sub}
        bg={bg}
      />

      <section className="section reveal">
        <div className="container">
          <div className="section-header">
            <div>
              <Eyebrow>{intro.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={intro.title} />
            </div>
            <RichText as="p" className="lead right" html={intro.lead} />
          </div>
        </div>
      </section>

      {Row1Section}

      {tilesAfterRow2 ? (
        <>
          {Row2Section}
          <section className="section alt reveal">
            <div className="container">
              <div className="section-header">
                <div>
                  <Eyebrow>{tilesSection.eyebrow}</Eyebrow>
                  <RuleGold />
                  <RichText as="h2" className="title-h2" html={tilesSection.title} />
                </div>
                <p className="lead right">{tilesSection.lead}</p>
              </div>
              <div className="services-grid reveal-stagger" style={{ marginTop: "var(--space-lg)" }}>
                {tiles.map((t) => (
                  <div key={t.title} className="service-tile">
                    {t.icon && <img className="icon" src={`/assets/icons/${t.icon}`} alt="" />}
                    {t.tag && <span className="eyebrow-sm">{t.tag}</span>}
                    <h3>{t.title}</h3>
                    <p>{t.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {TilesBlock}
          {Row2Section}
        </>
      )}

      <CtaStrip
        eyebrow={cta.eyebrow}
        titleHtml={cta.title}
        primary={{ label: cta.primary, href: L(cta.primaryPath) }}
        secondary={ctaSecondary}
      />
    </>
  );
}

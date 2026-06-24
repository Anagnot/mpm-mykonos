import { CtaStrip, Eyebrow, PageHeader, RuleGold } from "@/components/ui";

/* Single source of truth for the WhatsApp channel, matching the rest of the site. */
const WHATSAPP_NUMBER = "306973564477";

export type LandingHeader = { eyebrow: string; title: string; sub: string };
export type LandingCta = {
  eyebrow: string;
  title: string;
  primary: string;
  primaryPath: string;
  whatsapp: string;
  whatsappMessage: string;
};

/**
 * Lean landing-page template for transfer services. Drives content entirely
 * from the dictionary: a hero, the main copy, a highlights checklist, and a
 * dual CTA (booking + prefilled WhatsApp). Reused for each transfer landing page.
 */
export default function LandingTransferLayout({
  lang,
  bg,
  header,
  body,
  highlightsHeading,
  highlights,
  cta,
}: {
  lang: string;
  bg: string;
  header: LandingHeader;
  body: string[];
  highlightsHeading: string;
  highlights: string[];
  cta: LandingCta;
}) {
  const L = (p: string) => `/${lang}${p}`;
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(cta.whatsappMessage)}`;

  return (
    <>
      <PageHeader
        eyebrow={header.eyebrow}
        titleHtml={header.title}
        subHtml={header.sub}
        bg={bg}
        minHeight="60vh"
      />

      <section className="section reveal">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="landing-copy reveal-stagger">
            {body.map((p, i) => (
              <p className="lead" key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt reveal">
        <div className="container">
          <Eyebrow>{highlightsHeading}</Eyebrow>
          <RuleGold />
          <ul className="highlight-list reveal-stagger">
            {highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaStrip
        eyebrow={cta.eyebrow}
        titleHtml={cta.title}
        primary={{ label: cta.primary, href: L(cta.primaryPath) }}
        secondary={{ label: cta.whatsapp, href: whatsappHref }}
      />
    </>
  );
}

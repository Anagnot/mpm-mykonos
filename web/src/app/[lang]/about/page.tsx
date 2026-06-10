import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Counter from "@/components/Counter";
import { CtaStrip, Eyebrow, PageHeader, RichText, RuleGold } from "@/components/ui";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = (await getDictionary(lang)).meta.about;
  return { title: m.title, description: m.description };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang)).about;
  const L = (p: string) => `/${lang}${p}`;

  return (
    <>
      <PageHeader
        eyebrow={dict.header.eyebrow}
        titleHtml={dict.header.title}
        subHtml={dict.header.sub}
        bg="/uploads/site/psarrou-beach.jpg"
      />

      <section className="section reveal">
        <div className="container">
          <div className="about-grid">
            <div className="img-stack">
              <img className="a" src="/uploads/site/chauffeur-door.jpg" alt={dict.story.imgAlt1} />
              <img className="b" src="/uploads/site/van-interior.jpg" alt={dict.story.imgAlt2} />
            </div>
            <div>
              <Eyebrow>{dict.story.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.story.title} />
              <div style={{ height: 24 }} />
              <RichText as="p" html={dict.story.p1} />
              <RichText as="p" html={dict.story.p2} />
              <RichText as="p" html={dict.story.p3} />
            </div>
          </div>
        </div>
      </section>

      <section className="container reveal">
        <div className="stats-strip reveal-stagger">
          <div className="stat"><span className="num"><em><Counter to={8} /></em> yrs</span><span className="lbl">{dict.stats.years}</span></div>
          <div className="stat"><span className="num"><em><Counter to={30} /></em>+</span><span className="lbl">{dict.stats.locations}</span></div>
          <div className="stat"><span className="num">24<em>/</em>7</span><span className="lbl">{dict.stats.concierge}</span></div>
          <div className="stat"><span className="num"><em><Counter to={4.9} decimals={1} /></em></span><span className="lbl">{dict.stats.rating}</span></div>
        </div>
      </section>

      <section className="section reveal">
        <div className="container">
          <div className="section-header">
            <div>
              <Eyebrow>{dict.principles.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.principles.title} />
            </div>
            <p className="lead right">{dict.principles.lead}</p>
          </div>
          <div className="services-grid reveal-stagger">
            {dict.principles.items.map((p) => (
              <div key={p.title} className="service-tile">
                <img className="icon" src={`/assets/icons/${p.icon}`} alt="" />
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt reveal">
        <div className="container">
          <div className="section-header">
            <div>
              <Eyebrow>{dict.pillars.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.pillars.title} />
            </div>
            <p className="lead right">{dict.pillars.lead}</p>
          </div>
          {dict.pillars.items.map((p, i) => (
            <div key={p.eyebrow} className="fleet-row" style={i === 0 ? { borderTop: 0, paddingTop: 0 } : undefined}>
              <div className="fleet-row-text">
                <span className="eyebrow-sm">{p.eyebrow}</span>
                <RichText as="h3" html={p.title} />
                <p>{p.body}</p>
              </div>
              <div className="fleet-row-img"><img src={p.img} alt="" /></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section aegean reveal">
        <div className="container">
          <div className="testimonial">
            <Eyebrow>{dict.testimonial.eyebrow}</Eyebrow>
            <RuleGold />
            <p className="quote">{dict.testimonial.quote}</p>
            <RichText as="span" className="attribution" html={dict.testimonial.attribution} />
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

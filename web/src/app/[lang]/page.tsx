import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow, RichText, RuleGold } from "@/components/ui";
import { getDictionary, hasLocale } from "./dictionaries";

const heroBg = "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=2400&q=80";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const all = await getDictionary(lang);
  const dict = all.home;
  const common = all.common;
  const L = (p: string) => `/${lang}${p}`;

  return (
    <>
      <section className="hero">
        <div className="bg" style={{ backgroundImage: `url('${heroBg}')` }} />
        <div className="scrim" />
        <div className="content">
          <Eyebrow>{dict.hero.eyebrow}</Eyebrow>
          <RuleGold />
          <RichText as="h1" html={dict.hero.title} />
          <p className="lead">{dict.hero.lead}</p>
          <div className="actions">
            <Link href={L("/book")} className="btn btn-primary">{dict.hero.primary}</Link>
            <Link href={L("/services")} className="btn btn-secondary">{dict.hero.secondary}</Link>
          </div>
        </div>
        <span className="scroll-hint">{dict.hero.scrollHint}</span>
      </section>

      <section className="container" style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-lg)" }}>
        <div className="promise-strip reveal-stagger">
          {dict.promise.map((p) => (
            <div className="promise-item" key={p.title}>
              <img className="icon" src={`/assets/icons/${p.icon}`} alt="" />
              <h5>{p.title}</h5>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal" id="services">
        <div className="container">
          <div className="section-header">
            <div>
              <Eyebrow>{dict.services.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.services.title} />
            </div>
            <p className="lead right">{dict.services.lead}</p>
          </div>
          <div className="services-grid reveal-stagger">
            {dict.services.items.map((s) => (
              <Link key={s.id} className="service-tile" href={L(`/services#${s.id}`)}>
                <img className="icon" src={`/assets/icons/${s.icon}`} alt="" />
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <span className="link-luxe">{common.learnMore} <span>→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt reveal" id="fleet">
        <div className="container">
          <div className="section-header">
            <div>
              <Eyebrow>{dict.fleet.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.fleet.title} />
            </div>
            <p className="lead right">{dict.fleet.lead}</p>
          </div>
          <div className="fleet-grid reveal-stagger">
            {dict.fleet.items.map((v) => (
              <Link key={v.id} className="fleet-card" href={L(`/fleet#${v.id}`)}>
                <div className="img-wrap">
                  <img src={v.img} alt={v.name} />
                  <span className="badge">{v.badge}</span>
                </div>
                <div className="meta">
                  <span className="eyebrow-sm">{v.badge}</span>
                  <h4>{v.name}</h4>
                  <div className="specs">
                    {v.specs.map((spec, i) => {
                      const [num, label] = spec as [string | null, string];
                      return (
                        <span key={i}>{num ? <><b>{num}</b> {label}</> : label}</span>
                      );
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: "var(--space-lg)", display: "flex", justifyContent: "center" }}>
            <Link href={L("/fleet")} className="link-luxe">{dict.fleet.seeFull} <span>→</span></Link>
          </div>
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

      <section className="section reveal" id="locations">
        <div className="container">
          <div className="section-header">
            <div>
              <Eyebrow>{dict.locations.eyebrow}</Eyebrow>
              <RuleGold />
              <RichText as="h2" className="title-h2" html={dict.locations.title} />
            </div>
            <p className="lead right">{dict.locations.lead}</p>
          </div>
          <div className="locations-list reveal-stagger">
            {dict.locations.items.map((l) => (
              <Link key={l.path} className="location-row" href={L(l.path)}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span className="name">{l.name}</span>
                  <span className="meta">{l.meta}</span>
                </div>
                <img className="arrow" src="/assets/icons/icon-arrow-right.svg" alt="" />
              </Link>
            ))}
          </div>
          <div style={{ marginTop: "var(--space-lg)", display: "flex", justifyContent: "center" }}>
            <Link href={L("/locations")} className="link-luxe">{dict.locations.viewAll} <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="cta-strip reveal">
        <div className="inner">
          <div>
            <Eyebrow>{dict.cta.eyebrow}</Eyebrow>
            <RichText as="h3" html={dict.cta.title} />
          </div>
          <div className="right">
            <Link className="btn btn-primary" href={L("/book")}>{dict.cta.primary}</Link>
            <a className="btn btn-secondary" href="tel:+306973564477">+30 6973 564477</a>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow, RichText, RuleGold } from "@/components/ui";
import { getDictionary, hasLocale } from "./dictionaries";

const heroBg = "/uploads/site/chauffeur-door.jpg";

type ServiceTile = { id: string; path: string; icon: string; title: string; body: string; featured?: boolean };

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
            <Link href={L("/fleet")} className="btn btn-secondary">{dict.hero.secondary}</Link>
          </div>
        </div>
        <span className="scroll-hint">{dict.hero.scrollHint}</span>
      </section>

      <section className="section reveal" id="about">
        <div className="container">
          <div className="about-intro">
            <Eyebrow>{dict.about.eyebrow}</Eyebrow>
            <RuleGold center />
            <RichText as="h2" className="title-h2" html={dict.about.title} />
            {dict.about.body.map((p, i) => (
              <p className="lead" key={i}>{p}</p>
            ))}
            <Link href={L("/about")} className="btn btn-outline">{dict.about.cta}</Link>
          </div>
        </div>
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
          <div style={{ marginTop: "var(--space-lg)" }}>
            <Eyebrow>{dict.services.coreHeading}</Eyebrow>
            <RuleGold />
          </div>
          <div className="services-grid reveal-stagger" style={{ marginTop: 18 }}>
            {(dict.services.core as ServiceTile[]).map((s) => (
              <Link key={s.id} className={`service-tile${s.featured ? " is-featured" : ""}`} href={L(s.path)}>
                {s.featured && <span className="tile-badge">Signature</span>}
                <img className="icon" src={`/assets/icons/${s.icon}`} alt="" />
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <span className="btn btn-outline btn-tile">{common.learnMore}</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: "var(--space-lg)" }}>
            <Eyebrow>{dict.services.additionalHeading}</Eyebrow>
            <RuleGold />
          </div>
          <div className="services-grid reveal-stagger" style={{ marginTop: 18 }}>
            {dict.services.additional.map((s) => (
              <Link key={s.id} className="service-tile" href={L(s.path)}>
                <img className="icon" src={`/assets/icons/${s.icon}`} alt="" />
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <span className="btn btn-outline btn-tile">{common.learnMore}</span>
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
          <div className="fleet-grid two-up reveal-stagger">
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

import Link from "next/link";

type FooterLink = { path: string; label: string };

type FooterDict = {
  tag: string;
  pill: string;
  servicesHeading: string;
  locationsHeading: string;
  contactHeading: string;
  servicesLinks: FooterLink[];
  locationLinks: FooterLink[];
  viewAll: string;
  aboutUs: string;
  bookNow: string;
  rights: string;
  place: string;
};

export default function Footer({ lang, dict }: { lang: string; dict: FooterDict }) {
  const localized = (p: string) => `/${lang}${p}`;
  return (
    <footer className="site-footer">
      <div className="inner">
        <div className="brand-col">
          <img src="/assets/logo-mpm-wordmark-light.svg" alt="MPM Mykonos Precious Moments" />
          <p className="tag">{dict.tag}</p>
          <span className="promise-pill">{dict.pill}</span>
        </div>
        <div className="col">
          <h6>{dict.servicesHeading}</h6>
          {dict.servicesLinks.map((l) => (
            <Link key={l.path} href={localized(l.path)}>{l.label}</Link>
          ))}
        </div>
        {dict.locationLinks.length > 0 && (
          <div className="col">
            <h6>{dict.locationsHeading}</h6>
            {dict.locationLinks.map((l) => (
              <Link key={l.path} href={localized(l.path)}>{l.label}</Link>
            ))}
            <Link href={localized("/locations")}>{dict.viewAll}</Link>
          </div>
        )}
        <div className="col">
          <h6>{dict.contactHeading}</h6>
          <a href="tel:+306973564477">+30 6973 564477</a>
          <a href="https://wa.me/306973564477" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href="viber://chat?number=%2B306973564477">Viber</a>
          <a href="https://t.me/+306973564477" target="_blank" rel="noopener noreferrer">Telegram</a>
          <a href="mailto:info@mykonospreciousmoments.com">info@mykonos...</a>
          <a href="https://www.instagram.com/mpm.mykonospreciousmoments/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.facebook.com/profile.php?id=100090545221103" target="_blank" rel="noopener noreferrer">Facebook</a>
          <Link href={localized("/about")}>{dict.aboutUs}</Link>
          <Link href={localized("/book")}>{dict.bookNow}</Link>
        </div>
      </div>
      <div className="bottom">
        <span>{dict.rights}</span>
        <span style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}>{dict.place}</span>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type DropdownKey = "services";

type NavItem = { path: string; icon: string; label: string; meta: string };

type HeaderDict = {
  about: string;
  services: string;
  fleet: string;
  contact: string;
  bookNow: string;
  openMenu: string;
  contactBar?: { label: string; phoneLabel: string; whatsappLabel: string };
  servicesPanel: { eyebrow: string; title: string; desc: string; viewAll: string };
  servicesCoreHeading: string;
  servicesAdditionalHeading: string;
  servicesItemsCore: NavItem[];
  servicesItemsAdditional: NavItem[];
};

/* Single source of truth for the contact channels, matching the rest of the site. */
const PHONE_DISPLAY = "+30 6973 564477";
const PHONE_TEL = "tel:+306973564477";
const WHATSAPP_HREF = "https://wa.me/306973564477";

const groupLabelStyle: CSSProperties = {
  gridColumn: "1 / -1",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--color-gold)",
  padding: "10px 8px 6px",
};

const Caret = () => (
  <svg className="caret" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5l3 3 3-3" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.5 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.47-2.4-1.49-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.78-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.41 9.43-9.41 2.52 0 4.88.98 6.65 2.76a9.34 9.34 0 0 1 2.76 6.66c0 5.19-4.23 9.41-9.43 9.41zm8.02-17.43A11.31 11.31 0 0 0 12.04.75C5.83.75.8 5.79.8 11.99c0 1.98.52 3.92 1.5 5.63L.7 23.25l5.77-1.51a11.25 11.25 0 0 0 5.57 1.42h.01c6.2 0 11.24-5.04 11.24-11.24 0-3-1.17-5.82-3.3-7.85z" />
  </svg>
);

export default function Header({ lang, dict }: { lang: string; dict: HeaderDict }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<DropdownKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefix = `/${lang}`;
  const localized = (p: string) => `${prefix}${p}`;
  const showContactBar = lang === "en" && !!dict.contactBar;

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const handleTrigger = (key: DropdownKey) => () => {
    setOpen((current) => (current === key ? null : key));
  };

  const hoverOpen = (key: DropdownKey) => () => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      setOpen(key);
    }
  };

  const hoverClose = () => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      leaveTimer.current = setTimeout(() => setOpen(null), 150);
    }
  };

  const closeAll = () => setOpen(null);

  const isActive = (path: string) => {
    const href = localized(path);
    if (path === "/") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const linkClass = (path: string) => `nav-link${isActive(path) ? " active" : ""}`;
  const buttonClass = (key: DropdownKey) => `nav-link${isActive("/" + key) ? " active" : ""}`;

  const otherLocale = lang === "en" ? "el" : "en";
  const switchHref = (() => {
    const rest = pathname.replace(/^\/(en|el)/, "");
    return `/${otherLocale}${rest || ""}`;
  })();
  const switchLabel = otherLocale === "el" ? "ΕΛ" : "EN";

  return (
    <>
      <header className={`site-header${showContactBar ? " has-topbar" : ""}${solid || mobileOpen ? " solid" : ""}`}>
        {showContactBar && (
          <div className="header-topbar">
            <span className="topbar-tag"><span className="topbar-pulse" />{dict.contactBar!.label}</span>
            <div className="topbar-links">
              <a className="topbar-link" href={PHONE_TEL}>
                <PhoneIcon /><span>{PHONE_DISPLAY}</span>
              </a>
              <a className="topbar-link topbar-wa" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /><span>{dict.contactBar!.whatsappLabel}</span>
              </a>
            </div>
          </div>
        )}

        <div className="header-main">
          <Link className="brand" href={localized("/")}>MPM</Link>
          <nav className="nav">
            <div className="nav-item">
              <Link className={linkClass("/about")} href={localized("/about")}>{dict.about}</Link>
            </div>
            <div
              className={`nav-item has-dropdown${open === "services" ? " open" : ""}`}
              onMouseEnter={hoverOpen("services")}
              onMouseLeave={hoverClose}
            >
              <button className={buttonClass("services")} type="button" onClick={handleTrigger("services")}>
                {dict.services}<Caret />
              </button>
            </div>
            <div className="nav-item">
              <Link className={linkClass("/fleet")} href={localized("/fleet")}>{dict.fleet}</Link>
            </div>
            <div className="nav-item">
              <Link className={linkClass("/contact")} href={localized("/contact")}>{dict.contact}</Link>
            </div>
            <div className="nav-item">
              <Link className="nav-link lang-switch" href={switchHref}>{switchLabel}</Link>
            </div>
          </nav>
          <div className="header-actions">
            <a className="header-call" href={PHONE_TEL} aria-label={dict.contactBar?.phoneLabel ?? PHONE_DISPLAY}>
              <PhoneIcon />
            </a>
            <Link className="cta-circle" href={localized("/book")}>{dict.bookNow}</Link>
            <button
              className="menu-toggle"
              aria-label={dict.openMenu}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`nav-scrim${open ? " open" : ""}`} onClick={closeAll} />

      <div
        className={`dropdown${open === "services" ? " open" : ""}`}
        onMouseEnter={() => {
          if (leaveTimer.current) clearTimeout(leaveTimer.current);
        }}
        onMouseLeave={hoverClose}
      >
        <div className="dropdown-inner">
          <div className="left">
            <span className="eyebrow">{dict.servicesPanel.eyebrow}</span>
            <span className="rule-gold" />
            <h4>{dict.servicesPanel.title}</h4>
            <p className="desc">{dict.servicesPanel.desc}</p>
            <Link href={localized("/services")} className="link-luxe">{dict.servicesPanel.viewAll} <span>→</span></Link>
          </div>
          <div className="right">
            <div style={groupLabelStyle}>{dict.servicesCoreHeading}</div>
            {dict.servicesItemsCore.map((item) => (
              <Link key={item.label} href={localized(item.path)}>
                <img className="ico" src={`/assets/icons/${item.icon}`} alt="" />
                <div>
                  <div className="label">{item.label}</div>
                  <div className="meta">{item.meta}</div>
                </div>
                <img src="/assets/icons/icon-arrow-right.svg" alt="" style={{ width: 16, opacity: 0.4 }} />
              </Link>
            ))}
            <div style={groupLabelStyle}>{dict.servicesAdditionalHeading}</div>
            {dict.servicesItemsAdditional.map((item) => (
              <Link key={item.label} href={localized(item.path)}>
                <img className="ico" src={`/assets/icons/${item.icon}`} alt="" />
                <div>
                  <div className="label">{item.label}</div>
                  <div className="meta">{item.meta}</div>
                </div>
                <img src="/assets/icons/icon-arrow-right.svg" alt="" style={{ width: 16, opacity: 0.4 }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={`mobile-nav${mobileOpen ? " open" : ""}`}>
        <Link className="mobile-link" href={localized("/about")}>{dict.about}</Link>
        <details>
          <summary>{dict.services}</summary>
          {[...dict.servicesItemsCore, ...dict.servicesItemsAdditional].map((s) => (
            <Link key={s.label} className="sub-link" href={localized(s.path)}>{s.label}</Link>
          ))}
        </details>
        <Link className="mobile-link" href={localized("/fleet")}>{dict.fleet}</Link>
        <Link className="mobile-link" href={localized("/contact")}>{dict.contact}</Link>
        <Link className="mobile-link lang-switch" href={switchHref}>{switchLabel}</Link>
        <Link className="btn btn-primary mobile-cta" href={localized("/book")}>{dict.bookNow}</Link>
      </div>
    </>
  );
}

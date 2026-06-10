"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mpm-cookie-consent";

type CookieDict = {
  eyebrow: string;
  message: string;
  accept: string;
  decline: string;
};

/**
 * Cookie-consent notice. Shows on first visit and records the visitor's
 * choice ("accepted" / "declined") in localStorage so it never reappears
 * once answered. The choice is exposed under `mpm-cookie-consent` for any
 * future analytics/embed code to gate on.
 */
export default function CookieConsent({ dict }: { dict: CookieDict }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage blocked (private mode etc.) — fall through and show the notice.
    }
    if (!stored) {
      setOpen(true);
      document.body.classList.add("cookie-consent-open");
    }
    return () => {
      document.body.classList.remove("cookie-consent-open");
    };
  }, []);

  const choose = (value: "accepted" | "declined") => () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignore write failures — the notice still dismisses for this session.
    }
    document.body.classList.remove("cookie-consent-open");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="cookie-consent" role="region" aria-label={dict.eyebrow}>
      <div className="cookie-consent-inner">
        <div className="cookie-copy">
          <span className="eyebrow">{dict.eyebrow}</span>
          <p>{dict.message}</p>
        </div>
        <div className="cookie-actions">
          <button type="button" className="btn btn-secondary" onClick={choose("declined")}>
            {dict.decline}
          </button>
          <button type="button" className="btn btn-primary" onClick={choose("accepted")}>
            {dict.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

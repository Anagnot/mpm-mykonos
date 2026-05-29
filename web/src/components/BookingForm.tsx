"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";

type QuickPick = { key: string; icon: string; title: string; meta: string };

export type BookingFormDict = {
  step1: string;
  step2: string;
  service: string;
  vehicle: string;
  vehicleDefault: string;
  vehicleOptions: string[];
  serviceOptions: string[];
  pickup: string;
  pickupPlaceholder: string;
  destination: string;
  destinationPlaceholder: string;
  date: string;
  pickupTime: string;
  passengers: string;
  luggage: string;
  fullName: string;
  email: string;
  phone: string;
  flight: string;
  flightPlaceholder: string;
  notes: string;
  notesPlaceholder: string;
  privacy: string;
  submit: string;
  sentEyebrow: string;
  sentTitle: string;
  sentBody: string;
  sentBack: string;
  quickPicks: QuickPick[];
  svcMap: Record<string, string>;
};

const defaultDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
};

export default function BookingForm({ lang, dict }: { lang: string; dict: BookingFormDict }) {
  const searchParams = useSearchParams();

  const initialSvc = useMemo(() => {
    const svc = searchParams.get("svc");
    return svc && dict.svcMap[svc] ? dict.svcMap[svc] : dict.serviceOptions[0];
  }, [searchParams, dict]);

  const initialKey = useMemo(() => {
    const svc = searchParams.get("svc");
    return svc && dict.svcMap[svc] ? svc : null;
  }, [searchParams, dict]);

  const [service, setService] = useState<string>(initialSvc);
  const [activeKey, setActiveKey] = useState<string | null>(initialKey);
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("14:00");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setService(initialSvc);
    setActiveKey(initialKey);
  }, [initialSvc, initialKey]);

  const pick = (key: string) => {
    const label = dict.svcMap[key];
    if (label) {
      setService(label);
      setActiveKey(key);
    }
  };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 80, behavior: "smooth" });
  }

  if (sent) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          alignItems: "center",
          textAlign: "center",
          padding: "56px 24px",
          border: "1px solid var(--border-hairline)",
          background: "var(--color-white)",
        }}
      >
        <span className="eyebrow">{dict.sentEyebrow}</span>
        <span className="rule-gold" />
        <h2 className="title-h2" dangerouslySetInnerHTML={{ __html: dict.sentTitle }} />
        <p className="lead" style={{ margin: "0 auto" }}>
          {dict.sentBody}{" "}
          <a href="tel:+306973564477" style={{ color: "var(--color-gold)", textDecoration: "none" }}>+30 6973 564477</a>.
        </p>
        <div style={{ marginTop: 12 }}>
          <Link className="btn btn-secondary" href={`/${lang}`}>{dict.sentBack}</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="services-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: "var(--space-lg)" }}>
        {dict.quickPicks.map((q) => (
          <button
            key={q.key}
            type="button"
            onClick={() => pick(q.key)}
            className="service-tile"
            style={{
              cursor: "pointer",
              background: "none",
              textAlign: "left",
              borderTop: `1px solid ${activeKey === q.key ? "var(--color-gold)" : "var(--border-hairline)"}`,
            }}
          >
            <img className="icon" src={`/assets/icons/${q.icon}`} alt="" />
            <h3>{q.title}</h3>
            <p>{q.meta}</p>
          </button>
        ))}
      </div>

      <form className="booking" onSubmit={onSubmit}>
        <div className="full" style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 12 }}>
          <span className="eyebrow">{dict.step1}</span>
          <span className="rule-gold" />
        </div>

        <div className="field">
          <label htmlFor="bk-service">{dict.service}</label>
          <select id="bk-service" name="service" value={service} onChange={(e) => setService(e.target.value)}>
            {dict.serviceOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="bk-vehicle">{dict.vehicle}</label>
          <select id="bk-vehicle" name="vehicle" defaultValue={dict.vehicleDefault}>
            {dict.vehicleOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className="field"><label htmlFor="bk-from">{dict.pickup}</label><input id="bk-from" type="text" placeholder={dict.pickupPlaceholder} /></div>
        <div className="field"><label htmlFor="bk-to">{dict.destination}</label><input id="bk-to" type="text" placeholder={dict.destinationPlaceholder} /></div>

        <div className="field"><label htmlFor="bk-date">{dict.date}</label><input id="bk-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div className="field"><label htmlFor="bk-time">{dict.pickupTime}</label><input id="bk-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>

        <div className="field">
          <label htmlFor="bk-pax">{dict.passengers}</label>
          <select id="bk-pax" defaultValue="2">
            {["1", "2", "3", "4", "5", "6", "7", "8+"].map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="bk-bags">{dict.luggage}</label>
          <select id="bk-bags" defaultValue="2">
            {["0", "1", "2", "3", "4", "5+"].map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>

        <div className="full" style={{ display: "flex", flexDirection: "column", gap: 14, margin: "24px 0 12px" }}>
          <span className="eyebrow">{dict.step2}</span>
          <span className="rule-gold" />
        </div>

        <div className="field"><label htmlFor="bk-name">{dict.fullName}</label><input id="bk-name" type="text" required /></div>
        <div className="field"><label htmlFor="bk-email">{dict.email}</label><input id="bk-email" type="email" required /></div>
        <div className="field"><label htmlFor="bk-phone">{dict.phone}</label><input id="bk-phone" type="tel" placeholder="+30 ..." /></div>
        <div className="field"><label htmlFor="bk-flight">{dict.flight}</label><input id="bk-flight" type="text" placeholder={dict.flightPlaceholder} /></div>

        <div className="field full"><label htmlFor="bk-notes">{dict.notes}</label><textarea id="bk-notes" rows={3} placeholder={dict.notesPlaceholder} /></div>

        <div className="submit-row">
          <p className="privacy">{dict.privacy}</p>
          <button type="submit" className="btn btn-primary">{dict.submit}</button>
        </div>
      </form>
    </>
  );
}

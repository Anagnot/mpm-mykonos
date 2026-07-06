"use client";

import { useState, type FormEvent } from "react";

export type ContactFormDict = {
  fullName: string;
  email: string;
  phone: string;
  topic: string;
  topicPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  privacy: string;
  submit: string;
  sent: string;
};

export default function ContactForm({ dict }: { dict: ContactFormDict }) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <form className="booking" onSubmit={onSubmit}>
      <div className="field"><label htmlFor="ct-name">{dict.fullName}</label><input id="ct-name" type="text" required /></div>
      <div className="field"><label htmlFor="ct-email">{dict.email}</label><input id="ct-email" type="email" required /></div>
      <div className="field"><label htmlFor="ct-phone">{dict.phone}</label><input id="ct-phone" type="tel" placeholder="+30 ..." /></div>
      <div className="field">
        <label htmlFor="ct-topic">{dict.topic}</label>
        <input id="ct-topic" type="text" placeholder={dict.topicPlaceholder} />
      </div>
      <div className="field full"><label htmlFor="ct-msg">{dict.message}</label><textarea id="ct-msg" rows={4} placeholder={dict.messagePlaceholder} /></div>
      <div className="submit-row">
        <p className="privacy">{dict.privacy}</p>
        <button type="submit" className="btn btn-primary" disabled={sent}>
          {sent ? dict.sent : dict.submit}
        </button>
      </div>
    </form>
  );
}

/* Always-visible quick-contact controls — WhatsApp (primary) + Call.
   Rendered for the English site only (new copy/components are English for
   this round); flip the guard in layout.tsx to enable other locales. */

const PHONE_TEL = "tel:+306973564477";
const WHATSAPP_HREF = "https://wa.me/306973564477";

export default function StickyContact({
  whatsappLabel = "Chat on WhatsApp",
  callLabel = "Call now",
}: {
  whatsappLabel?: string;
  callLabel?: string;
}) {
  return (
    <div className="contact-fab" aria-label="Quick contact">
      <a
        className="fab fab-wa"
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={whatsappLabel}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.5 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.47-2.4-1.49-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.78-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.41 9.43-9.41 2.52 0 4.88.98 6.65 2.76a9.34 9.34 0 0 1 2.76 6.66c0 5.19-4.23 9.41-9.43 9.41zm8.02-17.43A11.31 11.31 0 0 0 12.04.75C5.83.75.8 5.79.8 11.99c0 1.98.52 3.92 1.5 5.63L.7 23.25l5.77-1.51a11.25 11.25 0 0 0 5.57 1.42h.01c6.2 0 11.24-5.04 11.24-11.24 0-3-1.17-5.82-3.3-7.85z" />
        </svg>
        <span className="fab-label">WhatsApp</span>
      </a>
      <a className="fab fab-call" href={PHONE_TEL} aria-label={callLabel}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
    </div>
  );
}

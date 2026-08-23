import { Building2, Mail, MapPin, MessageCircle, Globe } from "lucide-react";
import { COMPANY, CONTACT_INTRO } from "../terms-content";

const ROWS = [
  { icon: Building2, label: "Registered entity", value: COMPANY.legalName },
  { icon: MapPin, label: "Registered office", value: COMPANY.registeredOffice },
  { icon: Globe, label: "Website", value: COMPANY.website, href: COMPANY.website },
  { icon: Mail, label: "Email", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  {
    icon: MessageCircle,
    label: "Phone / WhatsApp",
    value: COMPANY.phone,
    href: `https://wa.me/${COMPANY.phone.replace(/[^\d]/g, "")}`,
  },
];

interface TermsContactCardProps {
  /** Zero-based position in the numbered section list. */
  index: number;
}

export function TermsContactCard({ index }: TermsContactCardProps) {
  return (
    <section id="contact-information" className="scroll-mt-28">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-xs font-semibold tabular-nums text-brand">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Contact Information</h2>
      </div>

      <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
        {CONTACT_INTRO}
      </p>

      <div className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl p-5 sm:p-6">
        <dl className="space-y-5">
          {ROWS.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex gap-4">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-muted">
                <Icon className="h-4 w-4 text-brand" />
              </span>
              <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-medium break-words">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-brand/40 underline-offset-4 transition-colors hover:text-brand"
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

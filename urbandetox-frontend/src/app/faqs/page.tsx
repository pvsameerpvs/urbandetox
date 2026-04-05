export const dynamic = 'force-dynamic';

import { listFaqs } from 'urbandetox-backend';

export default function FaqPage() {
  const faqs = listFaqs();

  return (
    <div className="page-shell space-y-6 py-16 pb-24">
      <div className="spotlight-card space-y-4">
        <p className="pill">FAQs</p>
        <h1 className="font-display text-5xl text-white">Questions across booking, onboarding, and privacy.</h1>
      </div>
      {faqs.map((faq) => (
        <article key={faq.id} className="surface-card space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-white/35">{faq.category}</p>
          <h2 className="text-xl font-semibold text-white">{faq.question}</h2>
          <p className="text-sm leading-7 text-white/65">{faq.answer}</p>
        </article>
      ))}
    </div>
  );
}

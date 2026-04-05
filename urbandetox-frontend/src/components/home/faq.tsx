const FAQs = [
  { q: 'How many people are in a group?', a: 'We restrict groups to 12-14 people to ensure a quality experience and local connection.' },
  { q: 'Is it safe for solo female travelers?', a: 'Absolutely. Over 60% of our travelers are solo females. Our group leads and heritage home hosts are thoroughly vetted.' },
  { q: 'What is the "Digital Detox" policy?', a: 'We encourage you to put your phone away during the trek and campfire. Our guides will take professional photos for you.' },
  { q: 'Are treks difficult?', a: 'We have categorized trips from "Easy" (walks) to "Moderate" (elevation). Each trip page has a difficulty rating.' },
];

export function FrequentlyAskedQuestions() {
  return (
    <section style={{ padding: 'clamp(4rem,10vw,8rem) 0', background: 'var(--cream)', borderTop: '1px solid var(--border-light)' }}>
      <div className="container" style={{ maxWidth: '800px', paddingInline: '2rem' }}>
        <p className="section-eyebrow" style={{ textAlign: 'center', marginBottom: '1.25rem' }}>Your Questions Answered</p>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>Common Queries</h2>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {FAQs.map((faq, i) => (
            <details
              key={faq.q}
              style={{
                background: 'white',
                padding: '1.5rem 2rem',
                borderRadius: '1.25rem',
                border: '1.5px solid var(--border-light)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <summary
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--forest-deep)',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {faq.q}
                <span style={{ fontSize: '1.2rem', color: 'var(--forest-mid)' }}>+</span>
              </summary>
              <p
                style={{
                  marginTop: '1.25rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-light)',
                }}
              >
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

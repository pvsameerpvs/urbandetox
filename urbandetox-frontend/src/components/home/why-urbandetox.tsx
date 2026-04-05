import Link from 'next/link';
import Image from 'next/image';

export function WhyUrbanDetox() {
  return (
    <section style={{ padding: 'clamp(4rem,10vw,8rem) 0', background: 'var(--forest-dark)', color: 'white', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', borderRadius: '2rem', overflow: 'hidden', height: 'clamp(400px, 50vw, 600px)', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)' }}>
            <Image
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80"
              alt="People enjoying nature"
              fill
              style={{ objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,60,47,0.4) 0%, transparent 60%)' }} />
          </div>

          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--lime)', marginBottom: '1.25rem' }}>
              The Real Experience
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '2rem' }}>
              We curate the <em style={{ color: 'var(--lime)', fontStyle: 'italic' }}>detox</em>, so you can focus on the escape.
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {[
                { title: 'Small Groups', desc: 'No buses full of strangers. Just a tight group of 10-14 travelers.', icon: '👥' },
                { title: 'Sustainable Stays', desc: 'We skip big hotels for heritage homes and colonial bungalows.', icon: '🏡' },
                { title: 'Expert Guides', desc: 'Real trekkers and locals who know the hidden trails.', icon: '🧭' },
                { title: 'Curated Itinerary', desc: 'Every minute is planned for maximum peace and zero stress.', icon: '✨' },
              ].map((item) => (
                <div key={item.title}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--sage-light)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3.5rem' }}>
              <Link href="/about" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                Learn More About Us →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

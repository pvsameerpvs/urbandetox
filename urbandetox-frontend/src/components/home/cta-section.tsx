import Link from 'next/link';
import Image from 'next/image';

export function CallToActionSection() {
  return (
    <section>
      <div className="container" style={{ paddingBlock: 'clamp(4rem,10vw,8rem)' }}>
        <div
          style={{
            background: 'var(--forest-dark)',
            borderRadius: '2.5rem',
            padding: '4rem 3rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=50)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '750px', marginInline: 'auto' }}>
            <p style={{ color: 'var(--lime)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Join the tribe</p>
            <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '1rem', lineHeight: 1.2 }}>
              Your next detox is waiting.
              <br />
              <em style={{ color: 'var(--lime)', fontStyle: 'italic' }}>Don&apos;t miss the batch.</em>
            </h2>
            <p style={{ color: 'var(--sage-light)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '500px', marginInline: 'auto' }}>
              Join thousands of city-dwellers who chose a real escape over a fake one. Sign up and we&apos;ll alert you when new departures go live.
            </p>
            <form style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '420px', marginInline: 'auto' }}>
              <input
                type="email"
                placeholder="Email Address"
                required
                style={{ flexGrow: 1, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.14)', color: 'white', padding: '0.95rem 1.75rem', borderRadius: '99px', minWidth: '240px' }}
              />
              <button className="btn-primary" style={{ paddingInline: '2rem' }}>Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

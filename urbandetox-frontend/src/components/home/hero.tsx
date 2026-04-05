import Link from 'next/link';
import Image from 'next/image';

interface HeroProps {
  image: string;
  packageCount: number;
  departureCount: number;
}

export function Hero({ image, packageCount, departureCount }: HeroProps) {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'clamp(520px, 90vh, 820px)',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src={image}
          alt="Scenic South India landscape"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(8,60,47,0.92) 0%, rgba(8,60,47,0.55) 45%, rgba(8,60,47,0.15) 100%)',
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: 'clamp(2.5rem,6vw,5rem)', paddingTop: '8rem', width: '100%' }}>
        <div style={{ maxWidth: '700px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(200,241,107,0.18)',
              color: 'var(--lime)',
              border: '1px solid rgba(200,241,107,0.3)',
              fontFamily: 'var(--font-superbusy-text), sans-serif',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.45rem 1rem',
              borderRadius: '99px',
              marginBottom: '1.25rem',
            }}
          >
            ✦ Weekend Escapes Across South India
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-superbusy-regular), serif',
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              fontWeight: 400,
              color: 'white',
              lineHeight: 1.05,
              marginBottom: '1.25rem',
              letterSpacing: '-0.01em',
            }}
          >
            Escape the City.
            <br />
            <em style={{ color: 'var(--lime)', fontStyle: 'normal' }}>Find Your Detox.</em>
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-superbusy-text), sans-serif',
              fontSize: 'clamp(1rem, 2vw, 1.1rem)',
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: '560px',
              letterSpacing: '0.01em',
            }}
          >
            Curated treks, retreats & weekend getaways to Kodaikanal, Gokarna, Kannur and beyond — in small groups that actually let you breathe.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/trips" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
              Explore Trips →
            </Link>
            <Link
              href="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.95rem',
                fontWeight: 500,
                padding: '0.9rem 2rem',
                border: '1.5px solid rgba(255,255,255,0.3)',
                borderRadius: '99px',
                transition: 'all 0.2s',
              }}
            >
              Our Story
            </Link>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0',
            marginTop: '3rem',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '1rem',
            overflow: 'hidden',
            maxWidth: '560px',
          }}
        >
          {[
            { num: `${packageCount}+`, label: 'Trip Packages' },
            { num: `${departureCount}+`, label: 'Active Departures' },
            { num: '500+', label: 'Happy Travelers' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                padding: '1rem 1.25rem',
                textAlign: 'center',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.14)' : 'none',
              }}
            >
              <p style={{ color: 'var(--lime)', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'var(--font-playfair), serif' }}>{stat.num}</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginTop: '0.2rem' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

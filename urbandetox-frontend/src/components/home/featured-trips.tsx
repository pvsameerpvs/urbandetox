import Link from 'next/link';
import Image from 'next/image';
import type { HomeDeparture, HomeTripPackage } from './types';

const TRIP_IMGS = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
];

interface FeaturedTripsProps {
  packages: HomeTripPackage[];
  departures: HomeDeparture[];
}

export function FeaturedTrips({ packages, departures }: FeaturedTripsProps) {
  const packageCards =
    packages.length > 0 ? packages.slice(0, 4) : Array<HomeTripPackage | null>(4).fill(null);

  return (
    <section style={{ background: '#f5f6f1', padding: 'clamp(4rem,10vw,7rem) 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: '650px', marginInline: 'auto' }}>
          <p className="section-eyebrow" style={{ marginBottom: '1rem' }}>Handpicked Escapes</p>
          <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>Upcoming Departures</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>
            Small groups (max 14), sustainable stays, and real local connections. No generic tourist trails, just detox.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
          {packageCards.map((pkg, i) => {
            const img = TRIP_IMGS[i % TRIP_IMGS.length];
            const depsForPkg = departures.filter((departure) => departure.packageId === pkg?.id);
            const cheapest = [...depsForPkg].sort(
              (left, right) => (left.offerPrice ?? left.price) - (right.offerPrice ?? right.price)
            )[0];

            return (
              <Link key={pkg?.id ?? i} href={`/trips/${pkg?.slug ?? `trip-${i + 1}`}`} className="card" style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <Image src={img} alt={pkg?.defaultName ?? 'Weekend trip'} fill className="trip-card-img" style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,60,47,0.5) 0%, transparent 55%)' }} />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.4rem' }}>
                    <span style={{ background: 'rgba(8,60,47,0.85)', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '99px', backdropFilter: 'blur(6px)' }}>
                      {pkg?.durationDays ?? 3}D / {pkg?.durationNights ?? 2}N
                    </span>
                    {pkg?.category && (
                      <span style={{ background: 'rgba(200,241,107,0.25)', color: 'var(--lime)', border: '1px solid rgba(200,241,107,0.3)', fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '99px' }}>
                        {pkg.category}
                      </span>
                    )}
                  </div>
                  {cheapest && cheapest.availableSeats < 8 && (
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: '#e05c2e', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 0.8rem', borderRadius: '99px' }}>
                      Only {cheapest.availableSeats} seats left!
                    </div>
                  )}
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                    {pkg?.destinationName ?? 'Kodaikanal'}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--forest-deep)', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                    {pkg?.defaultName ?? `Weekend Escape ${i + 1}`}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {pkg?.defaultDescription ?? 'Deep dive into lush mountains, stay in colonial bungalows and experience nature in its truest form.'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid #e5e7eb' }}>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginBottom: '0.1rem' }}>Starting from</p>
                      <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--forest-deep)' }}>
                        ₹{(cheapest?.offerPrice ?? cheapest?.price ?? pkg?.lowestPrice ?? 9500).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span style={{ background: 'var(--forest-deep)', color: 'var(--lime)', fontSize: '0.85rem', fontWeight: 700, padding: '0.6rem 1.25rem', borderRadius: '99px' }}>View →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

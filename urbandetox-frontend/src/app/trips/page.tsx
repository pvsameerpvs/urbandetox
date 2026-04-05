export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { listTripPackages, listFeaturedDepartures } from 'urbandetox-backend';

const TRIP_IMGS = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
  'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
];

const CATEGORIES = ['All', 'Weekend', 'Trek', 'Family', 'Corporate', 'Student'];
const DESTINATIONS_FILTER = ['All Destinations', 'Kodaikanal', 'Gokarna', 'Kannur'];

export default function TripsPage() {
  const packages = listTripPackages();
  const departures = listFeaturedDepartures();

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--forest-deep) 0%, var(--forest-dark) 100%)',
          padding: 'clamp(3rem,8vw,6rem) 0 clamp(2rem,5vw,4rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=50)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
        <div className="container" style={{ position: 'relative' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--lime)', marginBottom: '0.75rem' }}>All Trips</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: 'white', lineHeight: 1.15, marginBottom: '1rem' }}>Find Your Perfect Escape</h1>
          <p style={{ color: 'var(--sage-light)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '500px', marginBottom: '2.5rem' }}>
            Browse all upcoming departures. Filter by destination, category or date.
          </p>
          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '1.25rem',
              padding: '1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              alignItems: 'end',
            }}
          >
            <div>
              <label style={{ color: 'var(--sage-light)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Destination</label>
              <select style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.18)', color: 'white', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
                {DESTINATIONS_FILTER.map((d) => <option key={d} value={d.toLowerCase()}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--sage-light)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Category</label>
              <select style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.18)', color: 'white', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
                {CATEGORIES.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--sage-light)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Month</label>
              <input type="month" style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.18)', color: 'white', borderRadius: '0.75rem', padding: '0.75rem 1rem' }} />
            </div>
            <button className="btn-primary" style={{ padding: '0.78rem 1.5rem', fontSize: '0.9rem' }}>Search</button>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: '68px', zIndex: 30 }}>
        <div className="container" style={{ paddingBlock: '1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              style={{
                flexShrink: 0,
                padding: '0.5rem 1.25rem',
                borderRadius: '99px',
                border: cat === 'All' ? 'none' : '1.5px solid var(--border-medium)',
                background: cat === 'All' ? 'var(--forest-deep)' : 'transparent',
                color: cat === 'All' ? 'white' : 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Trip Grid */}
      <section style={{ padding: 'clamp(2rem,5vw,4rem) 0', background: 'var(--cream)', minHeight: '60vh' }}>
        <div className="container">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Showing <strong>{packages.length || 6} packages</strong> · {departures.length || 12} departures available
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,300px), 1fr))', gap: '1.5rem' }}>
            {(packages.length > 0 ? packages : Array(6).fill(null)).map((pkg, i) => {
              const img = TRIP_IMGS[i % TRIP_IMGS.length];
              const depsForPkg = departures.filter((d) => d.packageId === pkg?.id);
              const cheapest = depsForPkg.sort((a, b) => a.price - b.price)[0];
              return (
                <Link key={pkg?.id ?? i} href={`/trips/${pkg?.slug ?? `trip-${i + 1}`}`} className="card" style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                    <Image src={img} alt={pkg?.defaultName ?? 'Weekend trip'} fill style={{ objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,60,47,0.5) 0%, transparent 55%)' }} />
                    <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', display: 'flex', gap: '0.4rem' }}>
                      <span style={{ background: 'rgba(8,60,47,0.82)', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 0.7rem', borderRadius: '99px' }}>
                        {pkg?.durationDays ?? 3}D / {pkg?.durationNights ?? 2}N
                      </span>
                    </div>
                    {cheapest && cheapest.availableSeats < 8 && (
                      <div style={{ position: 'absolute', bottom: '0.85rem', left: '0.85rem', background: '#e05c2e', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '99px' }}>
                        Only {cheapest.availableSeats} seats left!
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--teal-mid)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                      {pkg?.destinationName ?? 'Kodaikanal'}
                    </p>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--forest-deep)', lineHeight: 1.3, marginBottom: '0.5rem' }}>
                      {pkg?.defaultName ?? `Weekend Escape ${i + 1}`}
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {pkg?.defaultDescription ?? 'An unforgettable escape through lush landscapes with guided treks and curated local stays.'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                      <div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginBottom: '0.1rem' }}>{depsForPkg.length || pkg?.departureCount || 3} departures</p>
                        <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--forest-deep)' }}>
                          ₹{(cheapest?.price ?? pkg?.lowestPrice ?? 9500).toLocaleString('en-IN')}
                          <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.25rem' }}>/ person</span>
                        </p>
                      </div>
                      <span style={{ background: 'var(--forest-deep)', color: 'var(--lime)', fontSize: '0.82rem', fontWeight: 700, padding: '0.55rem 1.15rem', borderRadius: '99px' }}>View →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

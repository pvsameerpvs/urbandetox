import Link from 'next/link';
import Image from 'next/image';

const DESTINATIONS = [
  { name: 'Kodaikanal', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80', count: 12 },
  { name: 'Gokarna', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', count: 8 },
  { name: 'Kannur', img: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=600&q=80', count: 5 },
];

export function TopDestinations() {
  return (
    <section style={{ padding: '0 0 clamp(3rem,8vw,6rem) 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="section-eyebrow" style={{ marginBottom: '0.6rem' }}>Local Curations</p>
            <h2 className="section-title">Top Destinations</h2>
          </div>
          <Link href="/trips" style={{ color: 'var(--forest-deep)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--forest-mid)' }}>View All Destinations</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {DESTINATIONS.map((dest) => (
            <Link key={dest.name} href={`/trips?dest=${dest.name.toLowerCase()}`} className="card" style={{ height: '380px', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '1.75rem', overflow: 'hidden' }}>
              <Image src={dest.img} alt={dest.name} fill className="trip-card-img" style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,60,47,0.7) 0%, transparent 60%)' }} />
              <span style={{ position: 'relative', zIndex: 1, color: 'white', fontFamily: 'var(--font-playfair), serif', fontSize: '1.75rem', fontWeight: 600 }}>{dest.name}</span>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.4rem 0.8rem', borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>{dest.count} Trips</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import type { HomeDeparture, HomeTripPackage } from './types';

interface LiveDeparturesProps {
  departures: HomeDeparture[];
  packages: HomeTripPackage[];
}

export function LiveDepartures({ departures, packages }: LiveDeparturesProps) {
  const departureCards =
    departures.length > 0 ? departures.slice(0, 5) : Array<HomeDeparture | null>(3).fill(null);

  return (
    <section style={{ background: 'var(--forest-dark)', color: 'white', padding: '3.5rem 0' }}>
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBlock: '1rem' }}>
          <div style={{ flexShrink: 0, paddingRight: '2rem', borderRight: '1.5px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'var(--lime)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Live Now</p>
            <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.25rem', fontWeight: 600 }}>Next Active<br />Departures</h3>
          </div>

          {departureCards.map((dep, i) => {
            const pkg = packages.find((p) => p.id === dep?.packageId);
            return (
              <div
                key={dep?.id ?? i}
                style={{
                  flexShrink: 0,
                  minWidth: '240px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.25px solid rgba(255,255,255,0.12)',
                  borderRadius: '1rem',
                  padding: '1.25rem',
                }}
              >
                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--lime)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  {dep?.startDate ? new Date(dep.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '15 APR'}
                </p>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.6rem' }}>
                  {pkg?.defaultName ?? 'Kodaikanal Weekend'}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>{dep?.availableSeats ?? 8} seats left</span>
                  <Link href={`/trips/${pkg?.slug ?? ''}`} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lime)' }}>Book →</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

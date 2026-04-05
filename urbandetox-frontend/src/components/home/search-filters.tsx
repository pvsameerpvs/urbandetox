const DESTINATIONS_FILTER = ['All Destinations', 'Kodaikanal', 'Gokarna', 'Kannur'];
const CATEGORIES = ['All', 'Weekend', 'Trek', 'Family', 'Corporate', 'Student'];

export function SearchFilters() {
  return (
    <section
      style={{
        marginTop: '-3.75rem',
        position: 'relative',
        zIndex: 10,
        paddingBottom: '3.5rem',
      }}
    >
      <div className="container">
        <div
          style={{
            background: 'var(--forest-deep)',
            border: '1.5px solid rgba(111,135,102,0.3)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sage-light)', marginBottom: '0.5rem' }}>
              Destination
            </label>
            <div style={{ position: 'relative' }}>
              <select style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.14)', color: 'white', padding: '0.82rem 1.25rem', borderRadius: '0.85rem' }}>
                {DESTINATIONS_FILTER.map((d) => <option key={d} value={d.toLowerCase()}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sage-light)', marginBottom: '0.5rem' }}>
              Category
            </label>
            <select style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.14)', color: 'white', padding: '0.82rem 1.25rem', borderRadius: '0.85rem' }}>
              {CATEGORIES.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sage-light)', marginBottom: '0.5rem' }}>
              Month
            </label>
            <div style={{ position: 'relative' }}>
              <input type="month" style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.14)', color: 'white', padding: '0.82rem 1.25rem', borderRadius: '0.85rem' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn-primary" style={{ width: '100%', padding: '0.88rem 1.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
              Search Detox →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
  Explore: [
    { href: '/trips',             label: 'All Trips' },
    { href: '/trips?cat=weekend', label: 'Weekend Escapes' },
    { href: '/trips?cat=trek',    label: 'Treks' },
    { href: '/corporate-retreats',label: 'Corporate Retreats' },
    { href: '/university-trips',  label: 'University Trips' },
  ],
  Destinations: [
    { href: '/trips?dest=kodaikanal', label: 'Kodaikanal' },
    { href: '/trips?dest=gokarna',    label: 'Gokarna' },
    { href: '/trips?dest=kannur',     label: 'Kannur' },
  ],
  Company: [
    { href: '/about',  label: 'About Us' },
    { href: '/blog',   label: 'Blog' },
    { href: '/travel-guides', label: 'Travel Guides' },
    { href: '/faqs',   label: 'FAQs' },
    { href: '/contact',label: 'Contact' },
  ],
  Legal: [
    { href: '/privacy',      label: 'Privacy Policy' },
    { href: '/terms',        label: 'Terms & Conditions' },
    { href: '/cancellation', label: 'Cancellation Policy' },
  ],
};

const SOCIAL = [
  { label: 'Instagram', href: 'https://instagram.com/urbandetox', icon: '📸' },
  { label: 'WhatsApp',  href: 'https://wa.me/918888888888',        icon: '💬' },
  { label: 'YouTube',   href: 'https://youtube.com/@urbandetox',   icon: '▶️' },
];

export function SiteFooter() {
  return (
    <footer style={{ background: 'var(--forest-dark)', color: 'var(--cream)' }}>
      {/* Top strip */}
      <div
        style={{
          background: 'var(--forest-deep)',
          borderBottom: '1px solid rgba(111,135,102,0.2)',
          padding: '2.5rem 0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lime)', marginBottom: '0.4rem' }}>
              Need help planning?
            </p>
            <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>
              Chat with us on WhatsApp — we reply fast.
            </p>
          </div>
          <a
            href="https://wa.me/918888888888"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            💬 WhatsApp Us
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="container" style={{ paddingBlock: '3.5rem 2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--lime)',
                  color: 'var(--forest-deep)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                }}
              >
                UD
              </span>
              <span style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>UrbanDetox</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--sage-light)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Curated weekend escapes across South India. Small groups, real places, genuine experiences.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--forest-mid)', marginBottom: '1rem' }}>
                {group}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="footer-link"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(111,135,102,0.2)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--forest-mid)' }}>
            © {new Date().getFullYear()} UrbanDetox. All rights reserved.
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--forest-mid)' }}>
            Made with 🌿 for travelers
          </p>
        </div>
      </div>
    </footer>
  );
}

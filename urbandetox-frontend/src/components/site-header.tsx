'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '/trips',            label: 'Trips' },
  { href: '/travel-guides',   label: 'Guides' },
  { href: '/blog',             label: 'Blog' },
  { href: '/corporate-retreats', label: 'Corporate' },
  { href: '/faqs',             label: 'FAQs' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          transition: 'all 0.3s ease',
          background: scrolled
            ? 'rgba(245,246,241,0.95)'
            : 'rgba(245,246,241,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled
            ? '1px solid rgba(111,135,102,0.25)'
            : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 16px rgba(8,60,47,0.06)' : 'none',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '68px',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--forest-deep)',
                color: 'var(--lime)',
                fontWeight: 800,
                fontSize: '0.85rem',
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              UD
            </span>
            <span
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontWeight: 700,
                fontSize: '1.2rem',
                color: 'var(--forest-deep)',
                letterSpacing: '-0.02em',
              }}
            >
              UrbanDetox
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hide-mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/login"
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                padding: '0.5rem 1rem',
                borderRadius: '99px',
                border: '1.5px solid var(--border-medium)',
                transition: 'all 0.2s',
              }}
              className="hide-mobile"
            >
              Sign in
            </Link>
            <Link href="/trips" className="btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.875rem' }}>
              Book a Trip
            </Link>

            {/* Mobile hamburger */}
            <button
              className="show-mobile"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                cursor: 'pointer',
              }}
              aria-label="Toggle menu"
            >
              <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--forest-deep)', borderRadius: '2px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
              <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--forest-deep)', borderRadius: '2px', opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }} />
              <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--forest-deep)', borderRadius: '2px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '68px',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 49,
            background: 'rgba(245,246,241,0.98)',
            backdropFilter: 'blur(16px)',
            padding: '1.5rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--forest-deep)',
                padding: '1rem 0',
                borderBottom: '1px solid var(--border-light)',
                fontFamily: 'var(--font-playfair), serif',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/login" className="btn-outline" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'center' }}>
              Sign in
            </Link>
            <Link href="/trips" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'center' }}>
              Book a Trip
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hide-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}

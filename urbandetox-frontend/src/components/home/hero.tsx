"use client";

import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  image: string;
}

export function Hero({ image }: HeroProps) {
  return (
    <section
      style={{
        position: "relative",
        height: "100svh",
        minHeight: "620px",
        maxHeight: "960px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
      }}
    >
      {/* ── Background Image ── */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Image
          src={image}
          alt="Scenic South India landscape"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />

        {/* Dark vignette at bottom for legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(8,30,20,0.96) 0%, rgba(8,30,20,0.72) 30%, rgba(8,30,20,0.2) 60%, transparent 100%)",
          }}
        />

        {/* Subtle top gradient for header readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(8,30,20,0.4) 0%, transparent 18%)",
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 2,
          paddingBottom: "clamp(14rem, 25vw, 18rem)", // Further reduction for better balance
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Headline group */}
        <div style={{ maxWidth: "820px" }}>
          {/* H1 — Superbusy Regular */}
          <h1
            style={{
              fontFamily: "var(--font-superbusy-regular), sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 400,
              color: "white",
              lineHeight: 1,
              letterSpacing: "-0.01em",
              marginBottom: "1.5rem",
            }}
          >
            Escape
            <br />
            <span style={{ color: "var(--lime)" }}>the City.</span>
          </h1>

          {/* Subtitle + CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            {/* Subtitle */}
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(0.9rem, 1.4vw, 1rem)",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.6,
                maxWidth: "420px",
              }}
            >
              Curated treks, retreats &amp; getaways in small&nbsp;groups —
              designed to help you truly disconnect.
            </p>

            {/* CTA group */}
            <div
              style={{
                display: "flex",
                gap: "0.85rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Link
                href="/trips"
                className="btn-primary"
                style={{
                  fontFamily: "var(--font-superbusy-text), sans-serif",
                  fontSize: "0.9rem",
                  letterSpacing: "0.02em",
                  padding: "0.85rem 1.85rem",
                }}
              >
                Explore Trips
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href="/about"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  padding: "0.75rem 1.25rem",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: "99px",
                  transition: "all 0.2s",
                  backdropFilter: "blur(6px)",
                }}
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "clamp(1.25rem, 4vw, 3rem)",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </p>
        <div
          style={{
            width: 1,
            height: "3rem",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Pulse keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </section>
  );
}

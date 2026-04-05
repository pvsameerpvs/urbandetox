"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { HomeDeparture, HomeTripPackage } from "./types";

/* ─── Destination image map ─── */
const DEST_IMAGES: Record<string, string> = {
  kodaikanal:
    "https://images.unsplash.com/photo-1598091383021-15ddf19bddb1?w=800&q=85",
  gokarna:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85",
  kannur:
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=85",
};
const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=85",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=85",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=85",
];

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  let first = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon, ... 6=Sat
  // Correct for Monday start (Mo=0, Tu=1 ... Su=6)
  const offset = first === 0 ? 6 : first - 1;
  const totalDays = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= totalDays; d++) days.push(new Date(year, month, d));
  return days;
}

interface Props {
  departures: HomeDeparture[];
  packages: HomeTripPackage[];
}

export function UpcomingDetoxes({ departures, packages }: Props) {
  const today = new Date();
  const [baseYear, setBaseYear] = useState(today.getFullYear());
  const [baseMonth, setBaseMonth] = useState(today.getMonth());
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  /* Only upcoming + published departures */
  const upcoming = useMemo(
    () =>
      departures
        .filter(
          (d) => d.tripStatus !== "completed" && new Date(d.startDate) >= today,
        )
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [departures],
  );

  /* Calendar: current month + next */
  const months = useMemo(() => {
    const results = [];
    for (let i = 0; i < 2; i++) {
      let m = baseMonth + i;
      let y = baseYear;
      if (m > 11) {
        m -= 12;
        y += 1;
      }
      results.push({ year: y, month: m, days: buildCalendarDays(y, m) });
    }
    return results;
  }, [baseMonth, baseYear]);

  function prevMonth() {
    if (baseMonth === 0) {
      setBaseMonth(11);
      setBaseYear((y) => y - 1);
    } else setBaseMonth((m) => m - 1);
  }
  function nextMonth() {
    if (baseMonth === 11) {
      setBaseMonth(0);
      setBaseYear((y) => y + 1);
    } else setBaseMonth((m) => m + 1);
  }

  /* Advanced lookup: trips per day (to support stacking) */
  const tripsPerDay = useMemo(() => {
    const map = new Map<string, HomeDeparture[]>();
    upcoming.forEach((d) => {
      const start = new Date(d.startDate);
      const end = new Date(d.endDate);
      const cur = new Date(start);
      while (cur <= end) {
        const key = cur.toISOString().slice(0, 10);
        const existing = map.get(key) || [];
        map.set(key, [...existing, d]);
        cur.setDate(cur.getDate() + 1);
      }
    });
    return map;
  }, [upcoming]);

  /* Nature-inspired palette for distinct trip coloring */
  const TRIP_PALETTE = [
    {
      bg: "rgba(200,241,107,0.4)",
      color: "var(--forest-deep)",
      activeBg: "var(--forest-deep)",
      activeColor: "var(--lime)",
    }, // Lime/Forest
    {
      bg: "rgba(74,157,148,0.3)",
      color: "#2C5F59",
      activeBg: "#2C5F59",
      activeColor: "#E6F3F1",
    }, // Teal
    {
      bg: "rgba(217,163,114,0.3)",
      color: "#6B4423",
      activeBg: "#6B4423",
      activeColor: "#FFF4EB",
    }, // Amber/Earth
    {
      bg: "rgba(122,158,126,0.3)",
      color: "#2D4B31",
      activeBg: "#2D4B31",
      activeColor: "#F2F7F3",
    }, // Sage
    {
      bg: "rgba(164,113,153,0.25)",
      color: "#5A2E4E",
      activeBg: "#5A2E4E",
      activeColor: "#FDF4FA",
    }, // Plum/Dusty
  ];

  function getTripColor(depId: string, isActive: boolean) {
    const idx = upcoming.findIndex((d) => d.id === depId);
    const theme = TRIP_PALETTE[idx % TRIP_PALETTE.length];
    return isActive
      ? { bg: theme.activeBg, text: theme.activeColor }
      : { bg: theme.bg, text: theme.color };
  }

  function handleDateClick(day: Date) {
    const key = day.toISOString().slice(0, 10);
    const dayTrips = tripsPerDay.get(key);
    if (dayTrips && dayTrips.length > 0) {
      setActiveDate(key === activeDate ? null : key);
      setTimeout(() => {
        cardsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    } else {
      setActiveDate(null);
    }
  }

  /* Cards to show — filter by selected date or show all */
  const visibleDeps = activeDate
    ? upcoming.filter((d) => {
        const start = d.startDate.slice(0, 10);
        const end = d.endDate.slice(0, 10);
        return activeDate >= start && activeDate <= end;
      })
    : upcoming;

  function getImage(dep: HomeDeparture, idx: number) {
    if (dep.coverPhotoOverride) return dep.coverPhotoOverride;
    const slug = dep.destinationSlug?.toLowerCase() ?? "";
    return DEST_IMAGES[slug] ?? FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
  }

  function getPackage(dep: HomeDeparture) {
    return packages.find((p) => p.id === dep.packageId);
  }

  const scrollCards = (dir: "left" | "right") => {
    if (!cardsRef.current) return;
    const amount = 320;
    cardsRef.current.scrollBy({
      left: dir === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      style={{
        background: "transparent",
        padding: "0 0 clamp(3rem,6vw,4rem)",
        marginTop: "-12rem", // Reduced overlay from -17rem for a more subtle straddle
        position: "relative",
        zIndex: 30,
      }}
    >
      <div className="container">
        {/* ── Consolidated Calendar Card (Streamlined) ── */}
        <div
          style={{
            background: "white",
            borderRadius: "var(--r-md)",
            border: "1px solid var(--border-light)",
            boxShadow: "0 12px 40px rgba(8,60,47,0.08)",
            padding: "2.5rem 2.2rem 1.3rem", // Increased top padding
            maxWidth: "640px", // Wider
            margin: "0 auto clamp(3rem, 5vw, 4rem)",
          }}
        >
          {/* Dual-month grid (Wide) */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2.5rem", // Added horizontal gap
              flexWrap: "wrap",
              position: "relative",
            }}
          >
            {months.map(({ year, month, days }, idx) => (
              <div
                key={`${year}-${month}`}
                style={{ width: "250px", flexShrink: 0 }}
              >
                {/* Month header with integrated arrows */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.1rem",
                    position: "relative",
                  }}
                >
                  {idx === 0 && (
                    <div style={{ position: "absolute", left: 0 }}>
                      <NavButton onClick={prevMonth} dir="left" />
                    </div>
                  )}

                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color: "var(--forest-deep)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {MONTHS[month]} {year}
                  </p>

                  {idx === 1 && (
                    <div style={{ position: "absolute", right: 0 }}>
                      <NavButton onClick={nextMonth} dir="right" />
                    </div>
                  )}
                </div>

                {/* Weekday headers */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {WEEKDAYS.map((d) => (
                    <div
                      key={d}
                      style={{
                        textAlign: "center",
                        fontSize: "0.65rem",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 600,
                        color: "var(--text-light)",
                        padding: "0.2rem 0",
                        opacity: 0.7,
                      }}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "2px 0px", // Horizontal gap removed for continuous pill look
                  }}
                >
                  {days.map((day, i) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${i}`}
                          style={{ aspectRatio: "1 / 1" }}
                        />
                      );
                    }

                    const key = day.toISOString().slice(0, 10);
                    const dayTrips = tripsPerDay.get(key) || [];
                    const isToday = isSameDay(day, today);
                    const isSelectedDate = key === activeDate;

                    return (
                      <div
                        key={key}
                        onClick={() => handleDateClick(day)}
                        style={{
                          aspectRatio: "1 / 1",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          padding: "2px 0",
                          cursor: dayTrips.length > 0 ? "pointer" : "default",
                        }}
                      >
                        {/* Underlay for Today highlight */}
                        {isToday && !isSelectedDate && (
                          <div
                            style={{
                              position: "absolute",
                              inset: "16%",
                              border: "1.5px solid var(--forest-deep)",
                              borderRadius: "50%",
                              zIndex: 1,
                            }}
                          />
                        )}

                        {/* Trip Bars */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            height: "70%", // Bars take up vertical space
                            gap: "1px",
                            zIndex: 2,
                          }}
                        >
                          {dayTrips.map((dep) => {
                            // Check if this trip intersects with the currently selected date
                            const isTripInActiveRange =
                              activeDate &&
                              activeDate >= dep.startDate.slice(0, 10) &&
                              activeDate <= dep.endDate.slice(0, 10);
                            const colors = getTripColor(
                              dep.id,
                              !!isTripInActiveRange,
                            );

                            const isStart = dep.startDate.slice(0, 10) === key;
                            const isEnd = dep.endDate.slice(0, 10) === key;

                            return (
                              <div
                                key={dep.id}
                                style={{
                                  flex: 1,
                                  background: colors.bg,
                                  borderTopLeftRadius: isStart ? "6px" : 0,
                                  borderBottomLeftRadius: isStart ? "6px" : 0,
                                  borderTopRightRadius: isEnd ? "6px" : 0,
                                  borderBottomRightRadius: isEnd ? "6px" : 0,
                                  transition: "all 0.2s ease",
                                }}
                              />
                            );
                          })}
                        </div>

                        {/* Date Number Overlay */}
                        <span
                          style={{
                            position: "absolute",
                            zIndex: 3,
                            width: "100%",
                            textAlign: "center",
                            fontSize: "0.72rem",
                            fontFamily: "var(--font-inter), sans-serif",
                            fontWeight: dayTrips.length > 0 ? 800 : 400,
                            color: dayTrips.some((d) => {
                              const s = d.startDate.slice(0, 10);
                              const e = d.endDate.slice(0, 10);
                              return (
                                activeDate && activeDate >= s && activeDate <= e
                              );
                            })
                              ? "white"
                              : "var(--forest-deep)",
                            pointerEvents: "none",
                          }}
                        >
                          {day.getDate()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Legend */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border-light)",
            }}
          >
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <LegendItem color="rgba(200,241,107,0.7)" label="Trip dates" />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "1rem", // Much tighter design
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-superbusy-text), sans-serif",
              fontSize: "0.9rem", // Increased size slightly for readability
              fontWeight: 400,
              color: "var(--teal-mid)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "0.25rem",
            }}
          >
            Plan Your Escape
          </p>
          <h2
            style={{
              fontFamily: "var(--font-superbusy-regular), sans-serif",
              fontSize: "2.5rem",
              fontWeight: 400,
              color: "var(--forest-deep)",
              lineHeight: 1,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Upcoming Detoxes
          </h2>

          {activeDate && (
            <button
              onClick={() => setActiveDate(null)}
              style={{
                marginTop: "0.75rem", // Reduced from 1.25rem
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.8rem",
                color: "var(--teal-mid)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              ← Show all departures
            </button>
          )}
        </div>

        {/* ── Navigation Arrows (Top-right of cards) ── */}
        {!activeDate && visibleDeps.length > 2 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem", // Reduced
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <NavButton onClick={() => scrollCards("left")} dir="left" />
              <NavButton onClick={() => scrollCards("right")} dir="right" />
            </div>
          </div>
        )}

        <div
          ref={cardsRef}
          style={{
            display: activeDate ? "grid" : "flex",
            gridTemplateColumns: activeDate
              ? "repeat(auto-fill, minmax(min(100%, 280px), 1fr))"
              : undefined,
            gap: "0.75rem",
            overflowX: activeDate ? "unset" : "auto",
            scrollbarWidth: "none",
            paddingBottom: "1.5rem", // Slight increase for shadow breathing room
            paddingTop: "1rem", // Reduced from 1.5rem
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
          }}
        >
          {visibleDeps.length === 0 ? (
            <EmptyState />
          ) : (
            visibleDeps.map((dep, idx) => {
              const pkg = getPackage(dep);
              const img = getImage(dep, idx);
              const isHovered = hoveredCard === dep.id;
              const price = dep.offerPrice ?? dep.price;
              const originalPrice = dep.offerPrice ? dep.price : null;
              const seatsLeft = dep.availableSeats;
              const fillPct = Math.round(dep.fillRate);
              const startDate = new Date(dep.startDate);
              const endDate = new Date(dep.endDate);
              const startMonth = startDate
                .toLocaleDateString("en-US", { month: "short" })
                .toUpperCase();
              const endMonth = endDate
                .toLocaleDateString("en-US", { month: "short" })
                .toUpperCase();
              const startDay = startDate.getDate();
              const endDay = endDate.getDate();

              let dateDisplay = "";
              if (startMonth === endMonth) {
                dateDisplay = `${startDay} - ${endDay} ${startMonth}`;
              } else {
                dateDisplay = `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
              }

              return (
                <Link
                  key={dep.id}
                  href={`/trips/${dep.packageSlug}/${dep.publicSlug}`}
                  style={{
                    flexShrink: 0,
                    width: activeDate ? "100%" : "clamp(200px, 20vw, 260px)",
                    display: "block",
                    textDecoration: "none",
                    borderRadius: "var(--r-md)",
                    overflow: "hidden",
                    background: "white",
                    border: "1px solid var(--border-light)",
                    boxShadow: isHovered
                      ? "0 16px 48px rgba(8,60,47,0.15)"
                      : "0 2px 12px rgba(8,60,47,0.06)",
                    transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                    transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                  onMouseEnter={() => setHoveredCard(dep.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Image */}
                  <div
                    style={{
                      position: "relative",
                      height: "130px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={img}
                      alt={dep.marketingTitle}
                      fill
                      sizes="340px"
                      style={{
                        objectFit: "cover",
                        transform: isHovered ? "scale(1.06)" : "scale(1)",
                        transition: "transform 0.5s ease",
                      }}
                    />
                    {/* Gradient */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(8,30,20,0.55) 0%, transparent 60%)",
                      }}
                    />
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "0.65rem 0.85rem 0.85rem" }}>
                    {/* Date indicator */}
                    <div
                      style={{
                        marginBottom: "0.4rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          color: "var(--teal-mid)",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {dateDisplay}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        lineHeight: 1.3,
                        marginBottom: "0.3rem",
                      }}
                    >
                      {dep.marketingTitle}
                    </h3>

                    {/* Description — expands on hover */}
                    <p
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.68rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                        marginBottom: "0.7rem", // Tighter spacing
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {dep.subtitle ??
                        pkg?.defaultDescription ??
                        "A curated escape in small groups designed to help you truly disconnect."}
                    </p>

                    {/* Seats fill bar (Restored but thinner) */}
                    <div style={{ marginBottom: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.3rem",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.65rem",
                            color:
                              seatsLeft <= 3 ? "#e05c2e" : "var(--text-light)",
                            fontWeight: seatsLeft <= 3 ? 700 : 400,
                          }}
                        >
                          {seatsLeft} {seatsLeft === 1 ? "seat" : "seats"} left
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.65rem",
                            color: "var(--text-light)",
                          }}
                        >
                          {dep.groupSizeMax} max
                        </span>
                      </div>
                      <div
                        style={{
                          height: "3px", // Thinner
                          background: "var(--mint-pale)",
                          borderRadius: "99px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(fillPct, 100)}%`,
                            background:
                              fillPct > 80
                                ? "#e05c2e"
                                : fillPct > 50
                                  ? "var(--lime)"
                                  : "var(--forest-mid)",
                            borderRadius: "99px",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* Price + CTA */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "0.85rem",
                        borderTop: "1px solid var(--border-light)",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.62rem",
                            color: "var(--text-light)",
                            margin: 0,
                          }}
                        >
                          per person
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "0.3rem",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-inter), sans-serif",
                              fontWeight: 800,
                              fontSize: "1.05rem", // Slightly larger for better emphasis
                              color: "var(--forest-deep)",
                            }}
                          >
                            ₹{price.toLocaleString("en-IN")}
                          </span>
                          {originalPrice && (
                            <span
                              style={{
                                fontFamily: "var(--font-inter), sans-serif",
                                fontSize: "0.72rem", // Matches compact aesthetic
                                color: "var(--text-light)",
                                textDecoration: "line-through",
                                opacity: 0.7,
                              }}
                            >
                              ₹{originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontFamily: "var(--font-superbusy-text), sans-serif",
                          fontSize: "0.72rem",
                          fontWeight: 400,
                          background: isHovered
                            ? "var(--lime)"
                            : "var(--forest-deep)",
                          color: isHovered ? "var(--forest-deep)" : "white",
                          padding: "0.45rem 0.85rem", // Slightly tighter
                          borderRadius: "8px",
                          transition: "all 0.25s ease",
                        }}
                      >
                        Book Now
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6h8M7 3l3 3-3 3"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* View all link */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link
            href="/trips"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.03rem",
              color: "var(--forest-deep)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.45rem 1.2rem",
              border: "1px solid var(--border-medium)",
              borderRadius: "99px",
              transition: "all 0.2s ease",
            }}
          >
            View all trips
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 8h12M10 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        [data-upcoming-cards]::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

/* ─── Sub-components ─── */

function LegendItem({
  color,
  label,
  border,
}: {
  color: string;
  label: string;
  border?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "3px",
          background: color,
          border: border ? "1.5px solid rgba(200,241,107,0.5)" : "none",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function NavButton({
  onClick,
  dir,
}: {
  onClick: () => void;
  dir: "left" | "right";
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "none",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "var(--text-muted)",
        transition: "all 0.2s",
        flexShrink: 0,
        opacity: 0.6,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.background = "rgba(0,0,0,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "0.6";
        e.currentTarget.style.background = "transparent";
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        {dir === "left" ? (
          <path
            d="M9 2L4 7l5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M5 2l5 5-5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        width: "100%",
        padding: "4rem 2rem",
        textAlign: "center",
        background: "white",
        borderRadius: "var(--r-lg)",
        border: "1px dashed var(--border-medium)",
      }}
    >
      <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🏔️</p>
      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "0.5rem",
        }}
      >
        No upcoming trips yet
      </p>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.875rem",
          color: "var(--text-muted)",
        }}
      >
        Check back soon — new departures are added every week.
      </p>
    </div>
  );
}

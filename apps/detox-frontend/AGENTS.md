# Urban Detox Frontend — Agent Guidelines

## Architecture Principles

### 1. Maximum Component Split (Hard Rule)
- **No page file over 150 lines**
- **No component file over 120 lines**
- When a file grows, extract into co-located components immediately
- Prefer 10 small files over 1 large file

### 2. Component Co-location
Components live next to the pages that use them:

```
app/
├── page.tsx                    # thin orchestrator (< 150 lines)
├── components/                 # page-specific sections
│   ├── Hero.tsx
│   └── FeatureGrid.tsx
└── [slug]/
    ├── page.tsx                # thin orchestrator
    └── components/             # detail-specific sections
        ├── DetailHero.tsx
        └── Sidebar.tsx
```

Shared primitives live in `app/book/components/` for cross-page reuse.

### 3. Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # root layout with providers
│   ├── globals.css             # imports + scrollbar utilities
│   ├── page.tsx                # homepage (orchestrator)
│   ├── about/
│   │   ├── page.tsx            # thin orchestrator
│   │   └── components/         # AboutHero, StatsBar, StorySection...
│   ├── contact/
│   │   ├── page.tsx
│   │   └── components/         # ContactHero, ContactForm, SideInfo...
│   ├── detox/
│   │   ├── page.tsx            # listing orchestrator
│   │   ├── components/         # PackageCard, FilterBar, ResultsSection
│   │   └── [packageSlug]/
│   │       ├── page.tsx        # detail orchestrator
│   │       └── components/     # PackageHero, InfoBar, GallerySection...
│   ├── book/
│   │   ├── components/         # SHARED: BookingHeader, BookingHero, BookingSummaryCard, MobileBookingCTA, Stepper, OnboardingNavigation, OnboardingSubmitted, PaymentStatusAlert, SuccessHero, NextStepsGrid
│   │   └── [departureCode]/
│   │       ├── page.tsx        # booking orchestrator
│   │       ├── components/     # DatePickerCard, TravelerForm, PaymentMethodOption
│   │       ├── onboarding/
│   │       │   ├── page.tsx    # onboarding orchestrator
│   │       │   ├── components/ # PrefilledBadge
│   │       │   └── steps/      # StepTravelParty, StepHealthFood, StepEmergency, StepConfirm
│   │       ├── payment/
│   │       │   └── page.tsx
│   │       └── success/
│   │           └── page.tsx
│   ├── guide/
│   │   ├── page.tsx
│   │   ├── components/         # GuideHero, GuideCard, FeaturedGuide
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── components/     # RelatedPackageCard, RelatedGuideCard, GuideCTA
│   ├── login/
│   │   ├── page.tsx
│   │   └── components/         # LoginHero, LoginForm
│   ├── my-detox/
│   │   ├── page.tsx
│   │   └── components/         # TripStatsBar, TripCard, EmptyState, PastTripsSection
│   └── profile/
│       ├── layout.tsx          # sidebar layout
│       ├── page.tsx            # profile overview
│       ├── personal/
│       │   └── page.tsx
│       ├── preferences/
│       │   └── page.tsx
│       ├── emergency/
│       │   └── page.tsx
│       ├── documents/
│       │   └── page.tsx
│       └── components/         # ProfileSectionHeader, IconInput, SaveButton
├── components/
│   ├── layout/
│   │   ├── navbar/             # Navbar, NavbarLogo, NavLinks, Actions, MobileMenu
│   │   │   └── hooks/
│   │   └── Footer.tsx
│   ├── sections/               # homepage sections
│   ├── providers.tsx           # UserProfileProvider wrapper
│   └── ui/                     # shadcn/ui primitives
├── lib/
│   ├── user-profile.tsx        # UserProfileContext + localStorage
│   ├── data.ts                 # service layer (mock data)
│   ├── formatters.ts           # formatPrice, formatDateRange
│   └── utils.ts                # cn() helper
├── data/                       # mock data files
└── hooks/                      # shared hooks
```

### 4. Page Orchestrator Pattern

Every page file follows this exact pattern:

```tsx
// 1. Imports (grouped: react, next, ui, components, lib, icons)
// 2. Data fetching at top level
// 3. Early return for notFound()
// 4. State hooks
// 5. Computed values
// 6. Return JSX — only assembling pre-built components
```

**Never define sub-components inside a page file.** Extract to `components/`.

### 5. Component File Template

```tsx
"use client"; // if interactive

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
// ... other imports

interface MyComponentProps {
  // explicit, typed props
}

export function MyComponent({ prop }: MyComponentProps) {
  return (
    // JSX
  );
}
```

### 6. State Architecture

**UserProfileContext** (`lib/user-profile.tsx`) is the single source of truth:
- Persists to `localStorage`
- Hydrates on mount (check `isHydrated`)
- All profile pages read/write through context
- Onboarding pre-fills from context with visual badges

```tsx
const { profile, updatePersonal, updateHealth } = useUserProfile();
```

**Page-level state** stays in the page component:
- Form inputs controlled locally
- Filter/search state in listing pages
- Step state in wizards

### 7. Responsive Design Rules

#### Breakpoints (Tailwind default)
- `sm:` ≥ 640px
- `md:` ≥ 768px  
- `lg:` ≥ 1024px
- `xl:` ≥ 1280px

#### Mobile-First Pattern
Always write mobile styles first, add responsive overrides:

```tsx
// Mobile: 1 column, gap-6
// Tablet+: 2 columns
// Desktop: 3 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

#### Touch-Friendly Minimums
- Buttons: minimum `h-11` (44px tap target)
- Inputs: minimum `h-12` (48px tap target)
- Cards: `rounded-2xl` for soft mobile feel
- Padding: `p-4 sm:p-5 md:p-6` — more padding on larger screens

#### Mobile Navigation
- Profile sidebar → horizontal scroll nav on mobile (`overflow-x-auto snap-x`)
- Stepper labels → hidden on mobile (`hidden sm:block`)
- Filter chips → horizontal scroll on mobile
- Sticky CTAs → fixed bottom bar on mobile (`lg:hidden`)

#### Calendar Mobile Fix
Wrap calendar in `overflow-x-auto` on small screens to prevent layout breakage:
```tsx
<div className="overflow-x-auto -mx-2 px-2">
  <Calendar ... />
</div>
```

### 8. Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Page | `kebab-case/page.tsx` | `my-detox/page.tsx` |
| Component | `PascalCase.tsx` | `BookingHeader.tsx` |
| Hook | `use-hook-name.ts` | `use-navbar-theme.ts` |
| Co-located components dir | `components/` | `about/components/` |
| Shared cross-page dir | `app/book/components/` | `BookingSummaryCard.tsx` |
| Step/wizard components | `steps/` | `onboarding/steps/StepTravelParty.tsx` |

### 9. Import Rules

```tsx
// 1. React / Next
import { useState } from "react";
import { useParams } from "next/navigation";

// 2. UI primitives
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 3. Co-located components (relative)
import { BookingHeader } from "../components/BookingHeader";   // from sibling
import { BookingHeader } from "../../components/BookingHeader"; // from parent
import { StepTravelParty } from "./steps/StepTravelParty";        // from child

// 4. Shared lib
import { useUserProfile } from "@/lib/user-profile";
import { fetchDepartureByCode } from "@/lib/data";

// 5. Icons (grouped last)
import { User, Calendar, ArrowRight } from "lucide-react";
```

### 10. Card Design System

All cards use the same class stack:
```
border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl
```

For flush image cards:
```
!gap-0 !py-0
```

### 11. Brand Color

Always use CSS variables, never hex codes in page files:
```tsx
// Correct
className="bg-brand text-brand-foreground"

// Wrong
className="bg-[#2d4f3c]"
```

`--brand` is `#2d4f3c`, a dark forest green. It reads at 9.15:1 on white, so
it is the right accent on light cards and light page backgrounds.

**It is unreadable on photos and dark grounds** — about 1.5-2.1:1 over a
darkened image and 1.98:1 on `--sidebar-dark`. For text or meaning-bearing
icons sitting on an image, a scrim, or a dark panel, use
`text-brand-on-media` (`#a7c4b5`), which holds 7.5:1 or better on the same
ground. Never reach for `text-brand` there.

Scrims need care too: over `black/30` nothing passes, not even pure white. A
`bg-gradient-to-t` is fully transparent at the top, so anything at
`absolute top-N` has no protection at all and needs its own solid background.

### 12. Animation Patterns

```tsx
// Page entrance
<motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

// Staggered grid
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.div variants={itemVariants}>...</motion.div>
</motion.div>

// Scroll-triggered
<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
```

### 13. Adding a New Page

1. Create `app/new-page/page.tsx` (< 150 lines, orchestrator only)
2. Create `app/new-page/components/` directory
3. Extract sections into components
4. Add route to navbar in `components/layout/navbar/nav-data.ts`
5. Build: `pnpm build` from repo root

### 14. Adding a New Component

1. If used by one page → put in `app/[page]/components/`
2. If used by multiple pages → put in closest shared `components/`:
   - Booking flow only → `app/book/components/`
   - Site-wide → `components/`
3. Keep under 120 lines
4. Export as named export: `export function ComponentName()`
5. Define explicit TypeScript interface for props

### 15. Build Verification

Always build before finishing:
```bash
cd /home/sameer/Documents/Project/my-personal/urbandetox/apps/detox-frontend
pnpm build
```

### 16. Git Rules

**Never run git commands automatically.** User manages git manually.
- Do not `git commit`, `git push`, `git add` unless explicitly asked
- Do not create `.gitignore` changes unless required for build

### 17. Critical Preserves

- **Font**: Geist Sans + Geist Mono — never change
- **Body text color**: `#1c1917` — never change
- **Muted text color**: `#78716c` — never change
- **Brand color**: `#2d4f3c` via CSS variables only — never use hex in component files
- **Brand on photos/dark**: `#a7c4b5` via `text-brand-on-media` — `text-brand` fails contrast there

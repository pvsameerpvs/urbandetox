export const dynamic = 'force-dynamic';

import { listTripPackages, listFeaturedDepartures } from 'urbandetox-backend';

// Split components
import { Hero } from '@/components/home/hero';
import { SearchFilters } from '@/components/home/search-filters';
import { TopDestinations } from '@/components/home/top-destinations';
import { FeaturedTrips } from '@/components/home/featured-trips';
import { WhyUrbanDetox } from '@/components/home/why-urbandetox';
import { LiveDepartures } from '@/components/home/live-departures';
import { BlogStories } from '@/components/home/blog-stories';
import { FrequentlyAskedQuestions } from '@/components/home/faq';
import { CallToActionSection } from '@/components/home/cta-section';

export default function HomePage() {
  const packages = listTripPackages();
  const departures = listFeaturedDepartures();

  // Hero uses a high-quality placeholder image
  const HERO_IMG = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=85';

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream-bg)' }}>
      {/* 1. Hero Section */}
      <Hero
        image={HERO_IMG}
        packageCount={packages.length || 12}
        departureCount={departures.length || 24}
      />

      {/* 2. Floating Search Bar */}
      <SearchFilters />

      {/* 3. Top Destinations */}
      <TopDestinations />

      {/* 4. Featured Trip Packages */}
      <FeaturedTrips packages={packages} departures={departures} />

      {/* 5. Why UrbanDetox Section */}
      <WhyUrbanDetox />

      {/* 6. Live Upcoming Departures Strip */}
      <LiveDepartures departures={departures} packages={packages} />

      {/* 7. Blog / Stories Section */}
      <BlogStories />

      {/* 8. FAQ Section */}
      <FrequentlyAskedQuestions />

      {/* 9. Final CTA Area */}
      <CallToActionSection />
    </main>
  );
}

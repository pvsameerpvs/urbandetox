export const dynamic = 'force-dynamic';

import { listTripPackages, listFeaturedDepartures } from 'urbandetox-backend';

// Split components
import { Hero } from '@/components/home/hero';
import { UpcomingDetoxes } from '@/components/home/upcoming-detoxes';
import { TopDestinations } from '@/components/home/top-destinations';
import { WhyUrbanDetox } from '@/components/home/why-urbandetox';
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
      />

      {/* 2. Upcoming Detoxes — Calendar + Trip Cards */}
      <UpcomingDetoxes departures={departures} packages={packages} />

      {/* 4. Top Destinations */}
      <TopDestinations />

      {/* 6. Why UrbanDetox Section */}
      <WhyUrbanDetox />

      {/* 7. Blog / Stories Section */}
      <BlogStories />

      {/* 8. FAQ Section */}
      <FrequentlyAskedQuestions />

      {/* 9. Final CTA Area */}
      <CallToActionSection />
    </main>
  );
}

import Link from 'next/link';
import Image from 'next/image';

const FEATURED_STORY = {
  id: 1,
  title: 'Sustainable travel in Kodaikanal — how we do it.',
  excerpt: 'A deep dive into our heritage stays and local partnerships that make your detox meaningful.',
  img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
  cat: 'Sustainability',
};

const LATEST_STORIES = [
  { id: 2, title: 'What is a "Digital Detox" truly?', excerpt: 'Why we ban phones for 4 hours of your trek.', img: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=600&q=80', cat: 'Guide' },
  { id: 3, title: 'The hidden waterfall of Kannur.', excerpt: 'A secret only our guides know.', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80', cat: 'Place' },
];

export function BlogStories() {
  return (
    <section style={{ padding: 'clamp(4rem,10vw,8rem) 0', background: 'white' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ maxWidth: '500px' }}>
            <p className="section-eyebrow" style={{ marginBottom: '0.8rem' }}>Stories from the Wild</p>
            <h2 className="section-title">The UrbanDetox Journal</h2>
          </div>
          <Link href="/blog" style={{ color: 'var(--forest-deep)', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid var(--forest-mid)' }}>Explore Blog →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <Link href={`/blog/${FEATURED_STORY.id}`} className="card" style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '300px' }}>
              <Image src={FEATURED_STORY.img} alt={FEATURED_STORY.title} fill className="trip-card-img" style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', padding: '0.3rem 0.8rem', background: 'var(--lime)', color: 'var(--forest-deep)', fontSize: '0.72rem', fontWeight: 700, borderRadius: '4px' }}>
                {FEATURED_STORY.cat}
              </div>
            </div>
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>{FEATURED_STORY.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{FEATURED_STORY.excerpt}</p>
            </div>
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {LATEST_STORIES.map((story) => (
              <Link key={story.id} href={`/blog/${story.id}`} className="card" style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '180px', flexShrink: 0 }}>
                  <Image src={story.img} alt={story.title} fill className="trip-card-img" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem', flexGrow: 1 }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--teal-mid)', marginBottom: '0.5rem' }}>{story.cat}</p>
                  <h4 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{story.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{story.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

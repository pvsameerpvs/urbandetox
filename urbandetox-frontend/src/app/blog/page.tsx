export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { listBlogPosts } from 'urbandetox-backend';

export default function BlogPage() {
  const posts = listBlogPosts();

  return (
    <div className="page-shell space-y-8 py-16 pb-24">
      <div className="spotlight-card space-y-4">
        <p className="pill">Blog</p>
        <h1 className="font-display text-5xl text-white">Operations-informed travel writing.</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="surface-card space-y-4">
            <h2 className="font-display text-3xl text-white">{post.title}</h2>
            <p className="text-sm leading-7 text-white/65">{post.excerpt}</p>
            <Link href={'/blog/' + post.slug} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[var(--brand-sand)] inline-flex">
              Read article
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

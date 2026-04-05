export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from 'urbandetox-backend';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="page-shell py-16 pb-24">
      <div className="spotlight-card max-w-4xl space-y-6">
        <p className="pill">Article</p>
        <h1 className="font-display text-5xl text-white">{post.title}</h1>
        <p className="text-base leading-8 text-white/72">{post.content}</p>
      </div>
    </article>
  );
}

export const dynamic = 'force-dynamic';

import { listBlogPostsAdmin } from 'urbandetox-backend';
import { createBlogPostAction } from '../../actions';

export default function BlogAdminPage() {
  const posts = listBlogPostsAdmin();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form action={createBlogPostAction} className="admin-card grid gap-4">
        <h2 className="font-display text-3xl text-slate-950">Publish blog post</h2>
        <input name="title" placeholder="How UrbanDetox plans smoother long weekends" required />
        <textarea name="excerpt" rows={3} placeholder="Short summary for cards and SEO" required />
        <textarea name="content" rows={10} placeholder="Write the full post here" required />
        <select name="status" defaultValue="published">
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
          Save post
        </button>
      </form>

      <div className="admin-card space-y-4">
        <h2 className="font-display text-3xl text-slate-950">Blog content</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div>
                    <p className="font-medium text-slate-950">{post.title}</p>
                    <p className="text-xs text-slate-500">/{post.slug}</p>
                  </div>
                </td>
                <td>{post.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

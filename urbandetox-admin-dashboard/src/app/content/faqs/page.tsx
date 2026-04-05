export const dynamic = 'force-dynamic';

import { listFaqsAdmin } from 'urbandetox-backend';
import { createFaqAction } from '../../actions';

export default function FaqsAdminPage() {
  const faqs = listFaqsAdmin();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form action={createFaqAction} className="admin-card grid gap-4">
        <h2 className="font-display text-3xl text-slate-950">Add FAQ</h2>
        <select name="category" defaultValue="booking">
          <option value="booking">Booking</option>
          <option value="travel">Travel</option>
          <option value="payments">Payments</option>
          <option value="safety">Safety</option>
        </select>
        <input name="question" placeholder="What happens after payment?" required />
        <textarea name="answer" rows={6} placeholder="Answer travelers see on the public site" required />
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
          Save FAQ
        </button>
      </form>

      <div className="admin-card space-y-4">
        <h2 className="font-display text-3xl text-slate-950">FAQ library</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Question</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td>{faq.category}</td>
                <td>{faq.question}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

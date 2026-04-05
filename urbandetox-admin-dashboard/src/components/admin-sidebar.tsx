import Link from 'next/link';

const sections = [
  {
    title: 'Overview',
    links: [{ href: '/', label: 'Dashboard' }, { href: '/analytics', label: 'Analytics' }],
  },
  {
    title: 'Content',
    links: [
      { href: '/content/banners', label: 'Banners' },
      { href: '/content/destinations', label: 'Destinations' },
      { href: '/content/packages', label: 'Packages' },
      { href: '/content/blog', label: 'Blog' },
      { href: '/content/travel-guides', label: 'Travel Guides' },
      { href: '/content/faqs', label: 'FAQs' },
    ],
  },
  {
    title: 'Trips',
    links: [
      { href: '/trips/departures', label: 'Departures' },
      { href: '/trips/participants', label: 'Participants' },
      { href: '/trips/checkin', label: 'Check-in' },
    ],
  },
  {
    title: 'Finance',
    links: [
      { href: '/finance/payments', label: 'Payments' },
      { href: '/finance/refunds', label: 'Refunds' },
      { href: '/customers', label: 'Customers' },
      { href: '/settings', label: 'Settings' },
    ],
  },
];

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-black/10 bg-[#f4efe5] px-6 py-8 lg:block">
      <Link href="/" className="flex items-center gap-3 text-sm uppercase tracking-[0.34em] text-slate-900">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d06c43,#f1c77b)] text-[0.7rem] font-semibold text-slate-950">UD</span>
        <span>Operations</span>
      </Link>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">{section.title}</p>
            <div className="grid gap-2 text-sm text-slate-700">
              {section.links.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-2xl px-3 py-2 transition hover:bg-white hover:text-slate-950">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export const dynamic = 'force-dynamic';

import { getSettingsSnapshot } from 'urbandetox-backend';

export default function SettingsPage() {
  const settings = getSettingsSnapshot();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <article className="admin-card space-y-4">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Trip policy</p>
          <h2 className="font-display text-3xl text-slate-950">Terms and cancellations</h2>
        </div>
        <div className="space-y-4 text-sm leading-7 text-slate-700">
          <div className="rounded-3xl bg-[#f8f5ef] p-4">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Latest terms</p>
            <p className="mt-2 font-semibold text-slate-950">
              {settings.latestTerms ? `${settings.latestTerms.title} (${settings.latestTerms.version})` : 'No terms configured'}
            </p>
            <p className="mt-2">{settings.latestTerms?.content ?? 'Add a terms version when legal copy is ready.'}</p>
          </div>
          <div className="rounded-3xl bg-[#f8f5ef] p-4">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Cancellation policy</p>
            <p className="mt-2 font-semibold text-slate-950">
              {settings.latestCancellationPolicy
                ? `${settings.latestCancellationPolicy.name} (${settings.latestCancellationPolicy.version})`
                : 'No policy configured'}
            </p>
            <p className="mt-2">{settings.latestCancellationPolicy?.summary ?? 'Add a cancellation policy when ready.'}</p>
          </div>
        </div>
      </article>

      <article className="admin-card space-y-6">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Access and messaging</p>
          <h2 className="font-display text-3xl text-slate-950">Operational defaults</h2>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">Staff roles</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {settings.staffRoles.map((role) => (
              <span key={role} className="rounded-full border border-black/10 bg-[#f8f5ef] px-4 py-2 text-sm text-slate-700">
                {role}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">Notification templates</p>
          <div className="mt-3 grid gap-3">
            {settings.notificationTemplates.map((template) => (
              <div key={template.id} className="rounded-3xl bg-[#f8f5ef] p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-950">{template.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{template.channel}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

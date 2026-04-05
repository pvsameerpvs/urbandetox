export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { formatDate, listDeparturesAdmin, listParticipantsAdmin } from 'urbandetox-backend';
import { addManualParticipantAction } from '../../actions';

export default function ParticipantsPage() {
  const departures = listDeparturesAdmin();
  const participants = listParticipantsAdmin();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <form action={addManualParticipantAction} className="admin-card grid gap-4">
        <h2 className="font-display text-3xl text-slate-950">Manual WhatsApp onboarding</h2>
        <select name="departureId" defaultValue="" required>
          <option value="" disabled>
            Select departure
          </option>
          {departures.map((departure) => (
            <option key={departure.id} value={departure.id}>
              {departure.tripCode} · {departure.marketingTitle}
            </option>
          ))}
        </select>
        <input name="fullName" placeholder="Traveler full name" required />
        <input name="phone" placeholder="Phone number" required />
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
          Add participant
        </button>
        <p className="text-sm leading-7 text-slate-600">
          This creates a participant row immediately so seat counts, manifests, and later payments stay in the same ledger.
        </p>
      </form>

      <div className="admin-card space-y-4">
        <h2 className="font-display text-3xl text-slate-950">Participants and onboarding state</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Traveler</th>
              <th>Trip</th>
              <th>Form</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => {
              const onboardingHref = `/booking/${participant.tripCode}/onboarding?participant=${participant.id}`;

              return (
                <tr key={participant.id}>
                  <td>
                    <div>
                      <p className="font-medium text-slate-950">{participant.fullName}</p>
                      <p className="text-xs text-slate-500">{participant.phone ?? 'Phone pending'}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p>{participant.tripCode}</p>
                      <p className="text-xs text-slate-500">{participant.destinationName}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p>{participant.participantStatus}</p>
                      <p className="text-xs text-slate-500">Updated {formatDate(participant.updatedAt)}</p>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`http://localhost:3000${onboardingHref}`}
                        className="rounded-full border border-black/10 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Open form
                      </Link>
                      <p className="text-[0.7rem] text-slate-500">
                        {participant.onboardingUsedAt ? 'Submitted once' : 'Awaiting submission'}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

import { formatDate, formatINR, listDeparturesAdmin, listParticipantsAdmin, listRefunds } from 'urbandetox-backend';
import { recordRefundAction } from '../../actions';

export default function RefundsPage() {
  const departures = listDeparturesAdmin();
  const participants = listParticipantsAdmin();
  const refunds = listRefunds();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <form action={recordRefundAction} className="admin-card grid gap-4">
        <h2 className="font-display text-3xl text-slate-950">Record refund</h2>
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
        <select name="participantId" defaultValue="">
          <option value="">No participant link</option>
          {participants.map((participant) => (
            <option key={participant.id} value={participant.id}>
              {participant.fullName} · {participant.tripCode}
            </option>
          ))}
        </select>
        <input name="amount" type="number" min="1" defaultValue="2000" required />
        <textarea name="note" rows={4} placeholder="Reason for refund" />
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
          Save refund
        </button>
      </form>

      <div className="admin-card space-y-4">
        <h2 className="font-display text-3xl text-slate-950">Refund ledger</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Trip</th>
              <th>Traveler</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((refund) => (
              <tr key={refund.id}>
                <td>{formatINR(refund.amount)}</td>
                <td>
                  <div>
                    <p>{refund.tripCode}</p>
                    <p className="text-xs text-slate-500">{refund.marketingTitle}</p>
                  </div>
                </td>
                <td>{refund.participantName ?? refund.customerName ?? 'Unassigned'}</td>
                <td>{refund.paidAt ? formatDate(refund.paidAt) : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

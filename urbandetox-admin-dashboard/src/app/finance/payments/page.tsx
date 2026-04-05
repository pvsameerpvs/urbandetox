export const dynamic = 'force-dynamic';

import { formatDate, formatINR, listDeparturesAdmin, listParticipantsAdmin, listPayments } from 'urbandetox-backend';
import { recordPaymentAction } from '../../actions';

export default function PaymentsPage() {
  const departures = listDeparturesAdmin();
  const participants = listParticipantsAdmin();
  const payments = listPayments();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <form action={recordPaymentAction} className="admin-card grid gap-4">
        <h2 className="font-display text-3xl text-slate-950">Record payment</h2>
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
        <div className="grid gap-4 md:grid-cols-2">
          <input name="amount" type="number" min="1" defaultValue="6999" required />
          <select name="paymentType" defaultValue="full">
            <option value="full">Full</option>
            <option value="partial">Partial</option>
            <option value="balance">Balance</option>
          </select>
        </div>
        <select name="source" defaultValue="upi">
          <option value="upi">UPI</option>
          <option value="bank_transfer">Bank transfer</option>
          <option value="cash">Cash</option>
          <option value="manual">Manual</option>
        </select>
        <textarea name="note" rows={4} placeholder="Optional finance note" />
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
          Save payment
        </button>
      </form>

      <div className="admin-card space-y-4">
        <h2 className="font-display text-3xl text-slate-950">Payments ledger</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Trip</th>
              <th>Traveler</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>
                  <div>
                    <p className="font-medium text-slate-950">{formatINR(payment.amount)}</p>
                    <p className="text-xs text-slate-500">{payment.paymentType}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p>{payment.tripCode}</p>
                    <p className="text-xs text-slate-500">{payment.marketingTitle}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p>{payment.participantName ?? payment.customerName ?? 'Unassigned'}</p>
                    <p className="text-xs text-slate-500">{payment.paidAt ? formatDate(payment.paidAt) : 'Pending date'}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p>{payment.source}</p>
                    <p className="text-xs text-slate-500">{payment.status}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

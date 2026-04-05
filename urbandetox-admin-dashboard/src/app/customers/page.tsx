export const dynamic = 'force-dynamic';

import { formatDate, listCustomers } from 'urbandetox-backend';

export default function CustomersPage() {
  const customers = listCustomers();

  return (
    <div className="admin-card space-y-4">
      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">CRM</p>
        <h2 className="font-display text-3xl text-slate-950">Traveler relationships</h2>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Trips</th>
            <th>Last booking</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.fullName}</td>
              <td>
                <div>
                  <p>{customer.email ?? 'No email'}</p>
                  <p className="text-xs text-slate-500">{customer.phone ?? 'No phone'}</p>
                </div>
              </td>
              <td>
                <div>
                  <p>{customer.totalTrips} trips</p>
                  <p className="text-xs text-slate-500">{customer.totalOrders} orders</p>
                </div>
              </td>
              <td>{customer.lastBookingAt ? formatDate(customer.lastBookingAt) : 'No booking yet'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

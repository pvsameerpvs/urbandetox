export interface BookingRecord {
  id: string;
  departureCode: string;
  fullName: string;
  phone: string;
  email?: string;
  travelers: number;
  createdAt: string;
}

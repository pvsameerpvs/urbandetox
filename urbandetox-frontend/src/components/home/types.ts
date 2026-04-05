import type { TripDepartureWithRelations, TripPackage } from 'urbandetox-backend';

export interface HomeTripPackage extends TripPackage {
  destinationName: string;
  destinationRegion: string;
  lowestPrice: number | null;
  departureCount: number;
  nextDepartureDate: string | null;
}

export type HomeDeparture = TripDepartureWithRelations;

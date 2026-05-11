"use client";

export interface Traveler {
  id: string;
  type: "primary" | "companion";
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  foodPreference: string;
  allergies: string;
  medicalConditions: string;
  bloodGroup: string;
  photoUrl: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
}

export interface CommonDetails {
  groupNote: string;
  modeOfArrival: string;
  needsTravelHelp: boolean;
}

export interface BookingState {
  departureCode: string;
  travelers: Traveler[];
  common: CommonDetails;
  onboardingComplete?: boolean;
}

const STORAGE_KEY = (code: string) => `urbandetox-booking-${code}`;

export function saveBookingState(state: BookingState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY(state.departureCode), JSON.stringify(state));
}

export function loadBookingState(departureCode: string): BookingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY(departureCode));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function createPrimaryTraveler(
  personal: {
    fullName: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    gender: string;
  },
  health: {
    foodPreference: string;
    allergies: string;
    medicalConditions: string;
    bloodGroup: string;
  },
  emergency?: {
    name: string;
    phone: string;
    relation: string;
  }
): Traveler {
  return {
    id: `t-${Date.now()}`,
    type: "primary",
    name: personal.fullName,
    phone: personal.phone,
    email: personal.email,
    dateOfBirth: personal.dateOfBirth,
    gender: personal.gender,
    foodPreference: health.foodPreference,
    allergies: health.allergies,
    medicalConditions: health.medicalConditions,
    bloodGroup: health.bloodGroup,
    photoUrl: "",
    emergencyName: emergency?.name ?? "",
    emergencyPhone: emergency?.phone ?? "",
    emergencyRelation: emergency?.relation ?? "",
  };
}

export function createCompanionTraveler(index: number = 0): Traveler {
  return {
    id: `t-${Date.now()}-${index}`,
    type: "companion",
    name: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    foodPreference: "vegetarian",
    allergies: "",
    medicalConditions: "",
    bloodGroup: "",
    photoUrl: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  };
}

export function createDefaultCommon(): CommonDetails {
  return {
    groupNote: "",
    modeOfArrival: "",
    needsTravelHelp: false,
  };
}

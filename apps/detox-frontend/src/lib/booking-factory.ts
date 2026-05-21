"use client";

import { type Traveler, type CommonDetails } from "@urbandetox/utils";

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
  emergency?: { name: string; phone: string; relation: string }
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
  return { groupNote: "", modeOfArrival: "", needsTravelHelp: false };
}

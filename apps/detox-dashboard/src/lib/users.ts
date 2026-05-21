"use client";

import { usersApi } from "@/features/users";

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  foodPreference: string;
  allergies: string;
  medicalConditions: string;
  bloodGroup: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  isLoggedIn: boolean;
  lastLoginAt: string;
  documentsUploaded: number;
  bookingsCount: number;
}

export function getAllUsers(): UserProfile[] {
  return usersApi.getAll();
}

export function getUserById(id: string): UserProfile | undefined {
  return usersApi.getById(id);
}

export function seedDemoUsers() {
  if (typeof window === "undefined") return;
  const STORAGE_KEY = "ud-admin-users";
  if (localStorage.getItem(STORAGE_KEY)) return;

  const users: UserProfile[] = [
    {
      id: "u-1",
      fullName: "Rahul Sharma",
      phone: "+91 98765 43210",
      email: "rahul@email.com",
      dateOfBirth: "1990-05-15",
      gender: "Male",
      foodPreference: "vegetarian",
      allergies: "None",
      medicalConditions: "None",
      bloodGroup: "O+",
      emergencyName: "Priya Sharma",
      emergencyPhone: "+91 98765 43211",
      emergencyRelation: "Spouse",
      isLoggedIn: true,
      lastLoginAt: "2026-01-20T10:30:00Z",
      documentsUploaded: 2,
      bookingsCount: 3,
    },
    {
      id: "u-2",
      fullName: "Priya Menon",
      phone: "+91 98765 43212",
      email: "priya@email.com",
      dateOfBirth: "1992-08-22",
      gender: "Female",
      foodPreference: "vegan",
      allergies: "Peanuts, Shellfish",
      medicalConditions: "None",
      bloodGroup: "A+",
      emergencyName: "Arun Menon",
      emergencyPhone: "+91 98765 43213",
      emergencyRelation: "Brother",
      isLoggedIn: true,
      lastLoginAt: "2026-01-18T14:15:00Z",
      documentsUploaded: 1,
      bookingsCount: 1,
    },
    {
      id: "u-3",
      fullName: "Arun Kumar",
      phone: "+91 99887 76655",
      email: "arun@email.com",
      dateOfBirth: "1985-03-10",
      gender: "Male",
      foodPreference: "non-vegetarian",
      allergies: "None",
      medicalConditions: "Mild asthma",
      bloodGroup: "B+",
      emergencyName: "Meera Kumar",
      emergencyPhone: "+91 99887 76656",
      emergencyRelation: "Sister",
      isLoggedIn: false,
      lastLoginAt: "2026-01-10T09:00:00Z",
      documentsUploaded: 0,
      bookingsCount: 2,
    },
    {
      id: "u-4",
      fullName: "Sneha Patel",
      phone: "+91 87654 32109",
      email: "sneha@email.com",
      dateOfBirth: "1995-11-05",
      gender: "Female",
      foodPreference: "jain",
      allergies: "Dairy",
      medicalConditions: "None",
      bloodGroup: "AB+",
      emergencyName: "Ravi Patel",
      emergencyPhone: "+91 87654 32110",
      emergencyRelation: "Father",
      isLoggedIn: true,
      lastLoginAt: "2026-01-19T16:45:00Z",
      documentsUploaded: 3,
      bookingsCount: 4,
    },
    {
      id: "u-5",
      fullName: "Vikram Rao",
      phone: "+91 76543 21098",
      email: "vikram@email.com",
      dateOfBirth: "1988-07-25",
      gender: "Male",
      foodPreference: "vegetarian",
      allergies: "None",
      medicalConditions: "Hypertension",
      bloodGroup: "O-",
      emergencyName: "Lakshmi Rao",
      emergencyPhone: "+91 76543 21099",
      emergencyRelation: "Mother",
      isLoggedIn: false,
      lastLoginAt: "2025-12-28T11:20:00Z",
      documentsUploaded: 1,
      bookingsCount: 1,
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

"use client";

import { createContext, useContext, useState, useCallback, useEffect, startTransition } from "react";

/* ─── Types ──────────────────────────────────── */

export interface PersonalInfo {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
}

export interface HealthInfo {
  foodPreference: string;
  allergies: string;
  medicalConditions: string;
  bloodGroup: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  email: string;
  relation: string;
}

export interface DocumentItem {
  id: string;
  label: string;
  description: string;
  status: "missing" | "uploaded" | "verified";
  hint: string;
}

export interface UserProfile {
  personal: PersonalInfo;
  health: HealthInfo;
  emergencyContacts: EmergencyContact[];
  documents: DocumentItem[];
}

/* ─── Default Data ───────────────────────────── */

export const defaultUserProfile: UserProfile = {
  personal: {
    fullName: "John Doe",
    phone: "+91 98765 43210",
    email: "john@example.com",
    dateOfBirth: "1990-05-15",
    gender: "male",
  },
  health: {
    foodPreference: "vegetarian",
    allergies: "None",
    medicalConditions: "None",
    bloodGroup: "O+",
  },
  emergencyContacts: [
    { name: "Jane Doe", phone: "+91 98765 43211", email: "jane@example.com", relation: "spouse" },
  ],
  documents: [
    { id: "govt-id", label: "Government ID", description: "Aadhaar / Passport / Driver's License", status: "missing", hint: "Accepted formats: PDF, JPG, PNG (max 5MB)" },
    { id: "photo", label: "Recent Photo", description: "Passport-size photograph for records", status: "missing", hint: "White background, no glasses (max 2MB)" },
    { id: "consent", label: "Consent Form", description: "Signed medical and liability waiver", status: "uploaded", hint: "We will send this before your trip." },
    { id: "insurance", label: "Travel Insurance", description: "Optional but recommended", status: "missing", hint: "Most Indian travel insurance policies cover hill trekking." },
  ],
};

const STORAGE_KEY = "urbandetox-user-profile";
const AUTH_KEY = "urbandetox-auth";

function loadFromStorage(): UserProfile {
  if (typeof window === "undefined") return defaultUserProfile;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUserProfile;
    return { ...defaultUserProfile, ...JSON.parse(raw) };
  } catch {
    return defaultUserProfile;
  }
}

function saveToStorage(profile: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function loadAuthFromStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

function saveAuthToStorage(isLoggedIn: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, String(isLoggedIn));
}

/* ─── Context ────────────────────────────────── */

interface UserProfileContextType {
  profile: UserProfile;
  isLoggedIn: boolean;
  login: (data?: Partial<PersonalInfo>) => void;
  logout: () => void;
  updatePersonal: (data: Partial<PersonalInfo>) => void;
  updateHealth: (data: Partial<HealthInfo>) => void;
  setEmergencyContacts: (contacts: EmergencyContact[]) => void;
  addEmergencyContact: () => void;
  removeEmergencyContact: (index: number) => void;
  updateEmergencyContact: (index: number, data: Partial<EmergencyContact>) => void;
  setDocuments: (docs: DocumentItem[]) => void;
  updateDocumentStatus: (id: string, status: DocumentItem["status"]) => void;
  isHydrated: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | null>(null);

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used inside UserProfileProvider");
  return ctx;
}

/* ─── Provider ───────────────────────────────── */

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setProfile(loadFromStorage());
      setIsLoggedIn(loadAuthFromStorage());
      setIsHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (isHydrated) saveToStorage(profile);
  }, [profile, isHydrated]);

  useEffect(() => {
    if (isHydrated) saveAuthToStorage(isLoggedIn);
  }, [isLoggedIn, isHydrated]);

  const login = useCallback((data?: Partial<PersonalInfo>) => {
    setIsLoggedIn(true);
    if (data) {
      setProfile((prev) => ({ ...prev, personal: { ...prev.personal, ...data } }));
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const updatePersonal = useCallback((data: Partial<PersonalInfo>) => {
    setProfile((prev) => ({ ...prev, personal: { ...prev.personal, ...data } }));
  }, []);

  const updateHealth = useCallback((data: Partial<HealthInfo>) => {
    setProfile((prev) => ({ ...prev, health: { ...prev.health, ...data } }));
  }, []);

  const setEmergencyContacts = useCallback((contacts: EmergencyContact[]) => {
    setProfile((prev) => ({ ...prev, emergencyContacts: contacts }));
  }, []);

  const addEmergencyContact = useCallback(() => {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: "", phone: "", email: "", relation: "" }],
    }));
  }, []);

  const removeEmergencyContact = useCallback((index: number) => {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  }, []);

  const updateEmergencyContact = useCallback((index: number, data: Partial<EmergencyContact>) => {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((c, i) => (i === index ? { ...c, ...data } : c)),
    }));
  }, []);

  const setDocuments = useCallback((docs: DocumentItem[]) => {
    setProfile((prev) => ({ ...prev, documents: docs }));
  }, []);

  const updateDocumentStatus = useCallback((id: string, status: DocumentItem["status"]) => {
    setProfile((prev) => ({
      ...prev,
      documents: prev.documents.map((d) => (d.id === id ? { ...d, status } : d)),
    }));
  }, []);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        isLoggedIn,
        login,
        logout,
        updatePersonal,
        updateHealth,
        setEmergencyContacts,
        addEmergencyContact,
        removeEmergencyContact,
        updateEmergencyContact,
        setDocuments,
        updateDocumentStatus,
        isHydrated,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  SUPABASE_ENV_ERROR,
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

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

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
}

/* ─── Default Data ───────────────────────────── */

export const defaultUserProfile: UserProfile = {
  personal: {
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
  },
  /**
   * Deliberately empty. These used to default to vegetarian / "None" / "O+",
   * and createPrimaryTraveler copied them straight onto the booking, so a
   * traveller who never opened /profile/preferences was submitted as blood
   * group O+ with no allergies and no medical conditions. Blood group is not
   * even editable in the logged-in onboarding, so the invented value could
   * never be corrected. Empty means "not provided", which is the truth.
   */
  health: {
    foodPreference: "",
    allergies: "",
    medicalConditions: "",
    bloodGroup: "",
  },
  emergencyContacts: [
    { name: "", phone: "", email: "", relation: "" },
  ],
  documents: [
    { id: "govt-id", label: "Government ID", description: "Aadhaar / Passport / Driver's License", status: "missing", hint: "Accepted formats: PDF, JPG, PNG (max 5MB)" },
    { id: "photo", label: "Recent Photo", description: "Passport-size photograph for records", status: "missing", hint: "White background, no glasses (max 2MB)" },
    { id: "consent", label: "Consent Form", description: "Signed medical and liability waiver", status: "missing", hint: "We will send this before your trip." },
    { id: "insurance", label: "Travel Insurance", description: "Optional but recommended", status: "missing", hint: "Most Indian travel insurance policies cover hill trekking." },
  ],
};

const STORAGE_KEY = "urbandetox-user-profile";

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
type SupabaseBrowserClient = ReturnType<typeof createClient>;

async function fetchWithAuth(path: string, options?: RequestInit) {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/* ─── Context ────────────────────────────────── */

interface UserProfileContextType {
  profile: UserProfile;
  authUser: AuthUser | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePersonal: (data: Partial<PersonalInfo>) => void;
  updateHealth: (data: Partial<HealthInfo>) => void;
  setEmergencyContacts: (contacts: EmergencyContact[]) => void;
  addEmergencyContact: () => void;
  removeEmergencyContact: (index: number) => void;
  updateEmergencyContact: (index: number, data: Partial<EmergencyContact>) => void;
  setDocuments: (docs: DocumentItem[]) => void;
  updateDocumentStatus: (id: string, status: DocumentItem["status"]) => void;
  refreshProfile: () => Promise<void>;
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
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [supabase, setSupabase] = useState<SupabaseBrowserClient | null>(null);

  // Stable callback — uses functional setProfile so it needs no deps
  const syncProfileFromAuth = useCallback(
    async (user: AuthUser) => {
      try {
        const serverProfile = await fetchWithAuth("/api/auth/me");
        setProfile((prev) => ({
          ...prev,
          personal: {
            fullName: serverProfile.fullName || user.fullName || prev.personal.fullName || "",
            phone: serverProfile.phone || user.phone || prev.personal.phone || "",
            email: user.email || serverProfile.email || prev.personal.email || "",
            dateOfBirth: serverProfile.dateOfBirth || prev.personal.dateOfBirth || "",
            gender: serverProfile.gender || prev.personal.gender || "",
          },
        }));
        setAuthUser(user);
        setIsLoggedIn(true);
      } catch {
        // If backend profile fetch fails, still mark as logged in with basic info
        setAuthUser(user);
        setIsLoggedIn(true);
        setProfile((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            email: user.email || prev.personal.email,
            fullName: user.fullName || prev.personal.fullName,
            phone: user.phone || prev.personal.phone,
          },
        }));
      }
    },
    [] // stable — all state reads use functional updater form
  );

  const refreshProfile = useCallback(async () => {
    if (!authUser) return;
    setIsLoading(true);
    try {
      const serverProfile = await fetchWithAuth("/api/auth/me");
      setProfile((prev) => ({
        ...prev,
        personal: {
          fullName: serverProfile.fullName || prev.personal.fullName,
          phone: serverProfile.phone || prev.personal.phone,
          email: serverProfile.email || prev.personal.email,
          dateOfBirth: serverProfile.dateOfBirth || prev.personal.dateOfBirth,
          gender: serverProfile.gender || prev.personal.gender,
        },
      }));
    } finally {
      setIsLoading(false);
    }
  }, [authUser]);

  // Single mount effect — hydrates localStorage, checks session, sets up listener
  useEffect(() => {
    let cancelled = false;

    // Hydrate from localStorage
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(loadFromStorage());

    if (!isSupabaseConfigured()) {
      console.warn(SUPABASE_ENV_ERROR);
      setIsHydrated(true);
      return () => {
        cancelled = true;
      };
    }

    let client: SupabaseBrowserClient;
    try {
      client = createClient();
    } catch (error) {
      console.error("[Auth] Failed to initialize Supabase client:", error);
      setIsHydrated(true);
      return () => {
        cancelled = true;
      };
    }

    setSupabase(client);

    // Check existing session
    client.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user) {
        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email || "",
          fullName: session.user.user_metadata?.full_name,
          phone: session.user.user_metadata?.phone,
          avatarUrl: session.user.user_metadata?.avatar_url,
        };
        syncProfileFromAuth(user);
      }
      setIsHydrated(true);
    });

    // Listen to auth changes
    const { data: listener } = client.auth.onAuthStateChange(
      (_event, session) => {
        if (cancelled) return;
        if (session?.user) {
          const user: AuthUser = {
            id: session.user.id,
            email: session.user.email || "",
            fullName: session.user.user_metadata?.full_name,
            phone: session.user.user_metadata?.phone,
            avatarUrl: session.user.user_metadata?.avatar_url,
          };
          syncProfileFromAuth(user);
        } else {
          setAuthUser(null);
          setIsLoggedIn(false);
        }
      }
    );

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [syncProfileFromAuth]);

  // Persist profile to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (isHydrated) saveToStorage(profile);
  }, [profile, isHydrated]);

  const login = useCallback(
    async (email: string, password: string) => {
      if (!supabase) throw new Error(SUPABASE_ENV_ERROR);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    },
    [supabase]
  );

  const signup = useCallback(
    async (email: string, password: string, fullName: string, phone: string) => {
      if (!supabase) throw new Error(SUPABASE_ENV_ERROR);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
        },
      });
      if (error) throw error;

      // After signup, user is auto-logged in. Upsert profile to backend.
      await fetchWithAuth("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ fullName, phone }),
      });
    },
    [supabase]
  );

  const loginWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error(SUPABASE_ENV_ERROR);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }, [supabase]);

  /**
   * Sends Supabase's own reset email. The link in it lands on /reset-password,
   * which must be present in the project's Auth redirect allowlist or Supabase
   * refuses to send. Errors are swallowed by the caller on purpose: telling a
   * stranger whether an address has an account here is an account-enumeration
   * leak, so the UI says "check your inbox" either way.
   */
  const requestPasswordReset = useCallback(
    async (email: string) => {
      if (!supabase) throw new Error(SUPABASE_ENV_ERROR);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    },
    [supabase]
  );

  const logout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAuthUser(null);
    setIsLoggedIn(false);
    /**
     * Signing out used to leave the profile in React state and in localStorage
     * under a single shared key. On any shared device the next person to sign
     * in inherited the previous user's name, phone, date of birth, medical
     * notes and emergency contacts, and those values auto-filled onto their
     * booking. Clear both.
     */
    setProfile(defaultUserProfile);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Private browsing can refuse storage access; state is already reset.
      }
    }
  }, [supabase]);

  const updatePersonal = useCallback(
    async (data: Partial<PersonalInfo>) => {
      setProfile((prev) => ({ ...prev, personal: { ...prev.personal, ...data } }));
      if (isLoggedIn) {
        try {
          await fetchWithAuth("/api/auth/profile", {
            method: "PUT",
            body: JSON.stringify(data),
          });
        } catch {
          // silently fail, localStorage is the source of truth
        }
      }
    },
    [isLoggedIn]
  );

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

  const updateEmergencyContact = useCallback(
    (index: number, data: Partial<EmergencyContact>) => {
      setProfile((prev) => ({
        ...prev,
        emergencyContacts: prev.emergencyContacts.map((c, i) =>
          i === index ? { ...c, ...data } : c
        ),
      }));
    },
    []
  );

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
        authUser,
        isLoggedIn,
        isHydrated,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        requestPasswordReset,
        logout,
        updatePersonal,
        updateHealth,
        setEmergencyContacts,
        addEmergencyContact,
        removeEmergencyContact,
        updateEmergencyContact,
        setDocuments,
        updateDocumentStatus,
        refreshProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

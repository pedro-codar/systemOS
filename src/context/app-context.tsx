"use client";

import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ProfileRole = "admin" | "collaborator";

export type Profile = {
  id: string;
  created_at: Date;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  whatsapp: string | null;
  role: ProfileRole;
  company_id: string;
  company_member_area_id: string | null;
};

export type Company = {
  id: string;
  created_at: Date;
  logo_url: string | null;
  owner_id: string | null;
  name: string | null;
};

export type AppContextData = {
  profile: Profile | null;
  company: Company | null;
  companyId: string | null;
  isAdmin: boolean;
};

type AppContextType = AppContextData & {
  loading: boolean;
  refresh: () => Promise<void>;
};

const emptyContextData: AppContextData = {
  profile: null,
  company: null,
  companyId: null,
  isAdmin: false,
};

const AppContext = createContext<AppContextType>({
  ...emptyContextData,
  loading: true,
  refresh: async () => {},
});

type ProfileRow = {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  whatsapp: string | null;
  role: ProfileRole | null;
  company_id: number;
  company_member_area_id: number | null;
};

type CompanyRow = {
  id: number;
  created_at: string;
  logo_url: string | null;
  owner_id: string | null;
  name: string | null;
};

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    created_at: new Date(row.created_at),
    name: row.name,
    email: row.email,
    avatar_url: row.avatar_url,
    whatsapp: row.whatsapp,
    role: row.role ?? "collaborator",
    company_id: String(row.company_id),
    company_member_area_id:
      row.company_member_area_id != null ? String(row.company_member_area_id) : null,
  };
}

function mapCompany(row: CompanyRow): Company {
  return {
    id: String(row.id),
    created_at: new Date(row.created_at),
    logo_url: row.logo_url,
    owner_id: row.owner_id,
    name: row.name,
  };
}

export async function fetchAppContextData(
  supabase: SupabaseClient,
  userId: string,
): Promise<AppContextData> {
  const [profileResult, ownedCompanyResult] = await Promise.all([
    supabase.from("profile").select("*").eq("id", userId).maybeSingle(),
    supabase
      .from("company")
      .select("id, created_at, logo_url, owner_id, name")
      .eq("owner_id", userId)
      .maybeSingle(),
  ]);

  const profile = profileResult.data ? mapProfile(profileResult.data as ProfileRow) : null;

  let company = ownedCompanyResult.data
    ? mapCompany(ownedCompanyResult.data as CompanyRow)
    : null;

  if (!company && profile?.company_id) {
    const { data } = await supabase
      .from("company")
      .select("id, created_at, logo_url, owner_id, name")
      .eq("id", profile.company_id)
      .maybeSingle();

    if (data) {
      company = mapCompany(data as CompanyRow);
    }
  }

  const companyId = profile?.company_id ?? company?.id ?? null;
  const isAdmin = profile?.role === "admin" || company?.owner_id === userId;

  return {
    profile,
    company,
    companyId,
    isAdmin,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppContextData>(emptyContextData);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setData(emptyContextData);
      setLoading(false);
      return;
    }

    setLoading(true);
    const nextData = await fetchAppContextData(supabase, user.id);
    setData(nextData);
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    async function loadUserData() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (!user) {
        setData(emptyContextData);
        setLoading(false);
        return;
      }

      const nextData = await fetchAppContextData(supabase, user.id);

      if (!isMounted) return;

      setData(nextData);
      setLoading(false);
    }

    loadUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        setData(emptyContextData);
        setLoading(false);
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        loadUserData();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AppContextType>(
    () => ({
      ...data,
      loading,
      refresh,
    }),
    [data, loading, refresh],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}

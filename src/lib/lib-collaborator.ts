import type { Collaborator, CollaboratorArea } from "@/components/collaborators/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type ProfileRow = {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  whatsapp: string | null;
  role: Collaborator["role"];
  company_id: number;
  company_member_area_id: number | null;
};

export function mapCollaborator(row: ProfileRow): Collaborator {
  return {
    id: row.id,
    created_at: new Date(row.created_at),
    name: row.name,
    email: row.email,
    avatar_url: row.avatar_url,
    whatsapp: row.whatsapp,
    role: row.role,
    company_id: String(row.company_id),
    company_member_area_id:
      row.company_member_area_id != null ? String(row.company_member_area_id) : null,
  };
}

export async function GetCollaborators(
  supabase: SupabaseClient,
  companyId: string | number,
) {
  const { data, error } = await supabase
    .from("profile")
    .select(
      "id, created_at, name, email, avatar_url, whatsapp, role, company_id, company_member_area_id",
    )
    .eq("company_id", companyId)
    .eq("role", "collaborator")
    .order("created_at", { ascending: false });

  return {
    data: data?.map(mapCollaborator) ?? null,
    error,
  };
}

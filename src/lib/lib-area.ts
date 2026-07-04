import type { CollaboratorArea } from "@/components/collaborators/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./supabase/client";

type AreaRow = {
  id: number;
  created_at: string;
  company_id: number;
  name: string | null;
};

export function mapCollaboratorArea(row: AreaRow): CollaboratorArea {
  return {
    id: String(row.id),
    created_at: new Date(row.created_at),
    company_id: String(row.company_id),
    name: row.name ?? "",
  };
}

export async function GetCollaboratorAreas(
  supabase: SupabaseClient,
  companyId: string | number,
) {
  const { data, error } = await supabase
    .from("company_member_area")
    .select("id, created_at, company_id, name")
    .eq("company_id", companyId)
    .order("name");

  return {
    data: data?.map(mapCollaboratorArea) ?? null,
    error,
  };
}

export async function CreateCollaboratorArea(name: string, companyId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("company_member_area")
    .insert({
      company_id: companyId,
      name,
    })
    .select("id, created_at, company_id, name")
    .single();

  return {
    data: data ? mapCollaboratorArea(data) : null,
    error,
  };
}

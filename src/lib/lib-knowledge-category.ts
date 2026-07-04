import type { KnowledgeCategory } from "@/components/knowledge/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DeleteKnowledgeEntrieByCategory } from "./lib-knowledge-entries";
import { createClient } from "./supabase/client";

type KnowledgeCategoryRow = {
  id: number;
  created_at: string;
  company_id: number;
  name: string;
  description: string | null;
};

export function mapKnowledgeCategory(row: KnowledgeCategoryRow): KnowledgeCategory {
  return {
    id: String(row.id),
    created_at: new Date(row.created_at),
    company_id: String(row.company_id),
    name: row.name,
    description: row.description ?? "",
  };
}

export async function GetKnowledgeCategories(
  supabase: SupabaseClient,
  companyId: string | number,
) {
  const { data, error } = await supabase
    .from("knowledge_category")
    .select("id, created_at, company_id, name, description")
    .eq("company_id", companyId)
    .order("created_at", { ascending: true });

  return {
    data: data?.map(mapKnowledgeCategory) ?? null,
    error,
  };
}

export async function CreateKnowledgeCategory(
  name: string,
  description: string,
  companyId: string,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("knowledge_category")
    .insert({
      company_id: companyId,
      name,
      description: description || null,
    })
    .select("id, created_at, company_id, name, description")
    .single();

  return {
    data: data ? mapKnowledgeCategory(data) : null,
    error,
  };
}

export async function DeleteKnowledgeCategory(categoryId: string) {
  const { error: entryError } = await DeleteKnowledgeEntrieByCategory(categoryId);
  if (entryError) return { error: entryError };

  const supabase = createClient();
  const { error } = await supabase
    .from("knowledge_category")
    .delete()
    .eq("id", categoryId);

  return { error };
}

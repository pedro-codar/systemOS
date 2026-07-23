import type {
  KnowledgeCategory,
  KnowledgeContextFormat,
} from "@/components/knowledge/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DeleteKnowledgeEntrieByCategory } from "./lib-knowledge-entries";
import { createClient } from "./supabase/client";

type KnowledgeCategoryRow = {
  id: number;
  created_at: string;
  company_id: number;
  name: string;
  description: string | null;
  context_format: KnowledgeContextFormat;
};

export function mapKnowledgeCategory(row: KnowledgeCategoryRow): KnowledgeCategory {
  return {
    id: String(row.id),
    created_at: new Date(row.created_at),
    company_id: String(row.company_id),
    name: row.name,
    description: row.description ?? "",
    context_format: row.context_format,
  };
}

export async function GetKnowledgeCategories(
  supabase: SupabaseClient,
  companyId: string | number,
) {
  const { data, error } = await supabase
    .from("knowledge_category")
    .select("id, created_at, company_id, name, description, context_format")
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
  contextFormat: KnowledgeContextFormat,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("knowledge_category")
    .insert({
      company_id: companyId,
      name,
      description: description || null,
      context_format: contextFormat,
    })
    .select("id, created_at, company_id, name, description, context_format")
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

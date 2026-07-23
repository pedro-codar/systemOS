import type { KnowledgeEntries } from "@/components/knowledge/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./supabase/client";

type KnowledgeEntryRow = {
  id: number;
  created_at: string;
  company_id: number;
  knowledge_category_id: number;
  content_plain: string;
  updated_at: string;
  pdf_url: string | null;
};

export function mapKnowledgeEntry(row: KnowledgeEntryRow): KnowledgeEntries {
  return {
    id: String(row.id),
    created_at: new Date(row.created_at),
    company_id: String(row.company_id),
    knowledge_category_id: String(row.knowledge_category_id),
    content_plain: row.content_plain,
    updated_at: new Date(row.updated_at),
    pdf_url: row.pdf_url,
  };
}

export async function GetKnowledgeEntries(
  supabase: SupabaseClient,
  companyId: string | number,
) {
  const { data, error } = await supabase
    .from("knowledge_entries")
    .select(
      "id, created_at, company_id, knowledge_category_id, content_plain, updated_at, pdf_url",
    )
    .eq("company_id", companyId)
    .order("created_at", { ascending: true });

  return {
    data: data?.map(mapKnowledgeEntry) ?? null,
    error,
  };
}

export async function CreateKnowledgeEntrie(
  company_id: string,
  knowledge_category_id: string,
  content_plain: string,
  updated_at: Date,
  pdf_url?: string | null,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("knowledge_entries")
    .insert({
      company_id,
      knowledge_category_id,
      content_plain,
      updated_at: updated_at.toISOString(),
      pdf_url: pdf_url ?? null,
    })
    .select("id")
    .single();

  return { data, error };
}

export async function UpdateKnowledgeEntrie(
  entry_id: string,
  content_plain: string,
  updated_at: Date,
  pdf_url?: string | null,
) {
  const supabase = createClient();
  const payload: {
    content_plain: string;
    updated_at: string;
    pdf_url?: string | null;
  } = {
    content_plain,
    updated_at: updated_at.toISOString(),
  };

  if (pdf_url !== undefined) {
    payload.pdf_url = pdf_url;
  }

  const { data, error } = await supabase
    .from("knowledge_entries")
    .update(payload)
    .eq("id", entry_id)
    .select("id")
    .single();

  return { data, error };
}

export async function DeleteKnowledgeEntrieByCategory(categoryId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("knowledge_entries")
    .delete()
    .eq("knowledge_category_id", categoryId);

  return { error };
}

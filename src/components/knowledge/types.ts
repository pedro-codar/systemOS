// knowledge category
export interface KnowledgeCategory {
  id: string;
  created_at: Date;
  company_id: string;
  name: string;
  description: string;
}

// knowledge entrie
export interface KnowledgeEntries {
  id: string;
  created_at: Date;
  company_id: string;
  knowledge_category_id: string;
  content_plain: string;
  updated_at: Date;
}

export type NewCategoryData = {
  name: string;
  description: string;
};

export function categoryHasContent(content: string | undefined) {
  const stripped = content?.replace(/<[^>]*>/g, "").trim();
  return Boolean(stripped);
}

export function getCategoryContentLabel(content: string | undefined) {
  return categoryHasContent(content) ? "Com conteúdo" : "Vazio";
}

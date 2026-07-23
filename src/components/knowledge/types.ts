export type KnowledgeContextFormat = "text" | "pdf";

// knowledge category
export interface KnowledgeCategory {
  id: string;
  created_at: Date;
  company_id: string;
  name: string;
  description: string;
  context_format: KnowledgeContextFormat;
}

// knowledge entrie
export interface KnowledgeEntries {
  id: string;
  created_at: Date;
  company_id: string;
  knowledge_category_id: string;
  content_plain: string;
  updated_at: Date;
  pdf_url: string | null;
}

export type NewCategoryData = {
  name: string;
  description: string;
  context_format: KnowledgeContextFormat;
};

export function categoryHasContent(content: string | undefined) {
  const stripped = content?.replace(/<[^>]*>/g, "").trim();
  return Boolean(stripped);
}

export function getCategoryContentLabel(
  content: string | undefined,
  pdfUrl?: string | null,
) {
  if (pdfUrl) return "Com conteúdo";
  return categoryHasContent(content) ? "Com conteúdo" : "Vazio";
}

export function getFileNameFromStoragePath(path: string | null | undefined) {
  if (!path) return null;
  const segments = path.split("/");
  const fileName = segments[segments.length - 1] ?? path;
  return fileName.replace(/^\d+-/, "");
}

import { createClient } from "./supabase/client";

export const COMPANY_DOCUMENTS_BUCKET = "company_documents";

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function UploadCompanyDocument(
  companyId: string,
  categoryId: string,
  file: File,
) {
  const supabase = createClient();
  const safeName = sanitizeFileName(file.name);
  const path = `${companyId}/${categoryId}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from(COMPANY_DOCUMENTS_BUCKET)
    .upload(path, file, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    return { path: null, error };
  }

  return { path, error: null };
}

export async function DeleteCompanyDocument(path: string) {
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(COMPANY_DOCUMENTS_BUCKET)
    .remove([path]);

  return { error };
}

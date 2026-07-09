import { KnowledgeBrain } from "@/components/knowledge/knowledge-brain";
import type { KnowledgeCategory } from "@/components/knowledge/types";
import { Sidebar } from "@/components/shared/sidebar";
import { GetKnowledgeCategories } from "@/lib/lib-knowledge-category";
import { GetKnowledgeEntries } from "@/lib/lib-knowledge-entries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base de conhecimento",
};

export default async function KnowledgePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  let initialCategories: KnowledgeCategory[] = [];
  let initialEntryContent: Record<string, string> = {};
  let initialEntryIds: Record<string, string> = {};

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("company_id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile?.company_id) {
    redirect("/chat");
  }

  if (profile.role !== "admin") {
    redirect("/chat");
  }

  const [{ data: categories }, { data: entries }] = await Promise.all([
    GetKnowledgeCategories(supabase, profile.company_id),
    GetKnowledgeEntries(supabase, profile.company_id),
  ]);

  initialCategories = categories ?? [];

  for (const entry of entries ?? []) {
    initialEntryContent[entry.knowledge_category_id] = entry.content_plain;
    initialEntryIds[entry.knowledge_category_id] = entry.id;
  }

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar activeItem="knowledge" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 px-6 py-4 max-sm:mt-10">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-foreground text-lg font-semibold">
                Base de conhecimento
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              O cérebro da empresa — todo o contexto que alimenta o assistente.
            </p>
          </div>
        </header>

        <main className="flex flex-1 flex-col overflow-hidden px-6 pb-6">
          <KnowledgeBrain
            initialCategories={initialCategories}
            initialEntryContent={initialEntryContent}
            initialEntryIds={initialEntryIds}
          />
        </main>
      </div>
    </div>
  );
}

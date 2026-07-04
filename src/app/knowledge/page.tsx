import { KnowledgeBrain } from "@/components/knowledge/knowledge-brain";
import type { KnowledgeCategory } from "@/components/knowledge/types";
import { Sidebar } from "@/components/shared/sidebar";
import { GetKnowledgeCategories } from "@/lib/lib-knowledge-category";
import { GetKnowledgeEntries } from "@/lib/lib-knowledge-entries";
import { createClient } from "@/lib/supabase/server";
import { Bell } from "lucide-react";

export default async function KnowledgePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialCategories: KnowledgeCategory[] = [];
  let initialEntryContent: Record<string, string> = {};
  let initialEntryIds: Record<string, string> = {};

  if (user) {
    const { data: company } = await supabase
      .from("company")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (company) {
      const [{ data: categories }, { data: entries }] = await Promise.all([
        GetKnowledgeCategories(supabase, company.id),
        GetKnowledgeEntries(supabase, company.id),
      ]);

      initialCategories = categories ?? [];

      for (const entry of entries ?? []) {
        initialEntryContent[entry.knowledge_category_id] = entry.content_plain;
        initialEntryIds[entry.knowledge_category_id] = entry.id;
      }
    }
  }

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar activeItem="knowledge" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 px-6 py-4">
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
          <button
            type="button"
            aria-label="Notificações"
            className="text-muted-foreground hover:text-foreground relative rounded-lg p-2 transition-colors"
          >
            <Bell className="size-5" />
          </button>
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

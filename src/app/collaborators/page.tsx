import { CollaboratorsHub } from "@/components/collaborators/collaborators-hub";
import type { CollaboratorArea } from "@/components/collaborators/types";
import { Sidebar } from "@/components/shared/sidebar";
import { GetCollaboratorAreas } from "@/lib/lib-area";
import { createClient } from "@/lib/supabase/server";
import { Bell } from "lucide-react";

export default async function CollaboratorsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let companyId = "";
  let initialAreas: CollaboratorArea[] = [];

  if (user) {
    const { data: company } = await supabase
      .from("company")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (company) {
      companyId = String(company.id);
      const { data: areas } = await GetCollaboratorAreas(supabase, company.id);
      initialAreas = areas ?? [];
    }
  }

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar activeItem="collaborators" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 px-6 py-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-foreground text-lg font-semibold">Colaboradores</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Gerencie quem tem acesso à plataforma da sua empresa.
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

        <main className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="mx-auto w-full max-w-2xl">
            <CollaboratorsHub
              initialAreas={initialAreas ?? []}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

import { CollaboratorsHub } from "@/components/collaborators/collaborators-hub";
import type { Collaborator, CollaboratorArea } from "@/components/collaborators/types";
import { Sidebar } from "@/components/shared/sidebar";
import { GetCollaboratorAreas } from "@/lib/lib-area";
import { GetCollaborators } from "@/lib/lib-collaborator";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colaboradores",
};

export default async function CollaboratorsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  let initialAreas: CollaboratorArea[] = [];
  let initialCollaborators: Collaborator[] = [];

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

  const [areasResult, collaboratorsResult] = await Promise.all([
    GetCollaboratorAreas(supabase, profile.company_id),
    GetCollaborators(supabase, profile.company_id),
  ]);

  initialAreas = areasResult.data ?? [];
  initialCollaborators = collaboratorsResult.data ?? [];

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar activeItem="collaborators" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 px-6 py-4 max-sm:mt-10">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-foreground text-lg font-semibold">Colaboradores</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Gerencie quem tem acesso à plataforma da sua empresa.
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="mx-auto w-full max-w-2xl">
            <CollaboratorsHub
              initialAreas={initialAreas}
              initialCollaborators={initialCollaborators}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

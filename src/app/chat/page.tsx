import { ChatShell } from "@/components/chat/chat-shell";
import { GetChatMessagesRecent } from "@/lib/lib-chat-message";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
};

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("id, name, email, company_id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile?.company_id) {
    redirect("/auth/login");
  }

  const { data: existingConversation, error: fetchError } = await supabase
    .from("chat_conversation")
    .select("id")
    .eq("profile_id", profile.id)
    .eq("company_id", profile.company_id)
    .maybeSingle();

  if (fetchError) {
    throw new Error("Não foi possível iniciar a conversa.");
  }

  let conversationId: string;

  if (!existingConversation) {
    const { data: createdConversation, error: createError } = await supabase
      .from("chat_conversation")
      .insert({
        profile_id: profile.id,
        company_id: profile.company_id,
      })
      .select("id")
      .single();

    if (createError || !createdConversation) {
      throw new Error("Não foi possível iniciar a conversa.");
    }

    conversationId = String(createdConversation.id);
  } else {
    conversationId = String(existingConversation.id);
  }

  const {
    data: initialMessages,
    hasMore: hasMoreOlder,
    error: messagesError,
  } = await GetChatMessagesRecent(supabase, conversationId);

  if (messagesError) {
    throw new Error("Não foi possível carregar as mensagens.");
  }

  const userName = profile.name ?? profile.email ?? "usuário";
  const userRole = profile.role === "admin" ? "admin" : "collaborator";

  return (
    <ChatShell
      conversationId={conversationId}
      initialMessages={initialMessages ?? []}
      initialHasMoreOlder={hasMoreOlder}
      userName={userName}
      userRole={userRole}
    />
  );
}

"use server";

import { createClient } from "@/lib/supabase/server";

export async function triggerChat(chatConversationId: number, message: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const trimmed = message.trim();
  if (!trimmed) {
    return { error: "Message is required" };
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL_CHAT;
  if (!webhookUrl) {
    return { error: "Webhook not configured" };
  }

  const { data: conversation } = await supabase
    .from("chat_conversation")
    .select("id")
    .eq("id", chatConversationId)
    .eq("profile_id", user.id)
    .single();

  if (!conversation) {
    return { error: "Conversation not found" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_conversation_id: chatConversationId,
        profile_id: user.id,
        message: trimmed,
      }),
    });

    if (!response.ok) {
      return { error: "Failed to trigger chat workflow" };
    }

    return { success: true };
  } catch {
    return { error: "Failed to trigger chat workflow" };
  }
}

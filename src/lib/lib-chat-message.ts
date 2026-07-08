import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./supabase/client";

export const CHAT_MESSAGES_PAGE_SIZE = 20;

export type ChatMessageRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  created_at: string;
  chat_conversation_id: string;
  role: ChatMessageRole;
  content: string;
};

export type ChatMessageRow = {
  id: number;
  created_at: string;
  chat_conversation_id: number | null;
  role: "agent" | "user";
  content: string | null;
};

export function mapChatMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: String(row.id),
    created_at: row.created_at,
    chat_conversation_id:
      row.chat_conversation_id != null ? String(row.chat_conversation_id) : "",
    role: row.role === "agent" ? "assistant" : "user",
    content: row.content ?? "",
  };
}

function mapRows(rows: ChatMessageRow[]) {
  return rows.map((row) => mapChatMessage(row));
}

export function mergeChatMessages(
  existing: ChatMessage[],
  incoming: ChatMessage[],
): ChatMessage[] {
  const map = new Map(existing.map((message) => [message.id, message]));

  for (const message of incoming) {
    map.set(message.id, message);
  }

  return Array.from(map.values()).sort(
    (a, b) => Number(a.id) - Number(b.id),
  );
}

export async function GetChatMessagesRecent(
  supabase: SupabaseClient,
  conversationId: string | number,
  limit = CHAT_MESSAGES_PAGE_SIZE,
) {
  const { data, error } = await supabase
    .from("chat_message")
    .select("id, created_at, chat_conversation_id, role, content")
    .eq("chat_conversation_id", conversationId)
    .order("id", { ascending: false })
    .limit(limit);

  const rows = (data ?? []) as ChatMessageRow[];
  const messages = mapRows(rows).reverse();

  return {
    data: messages.length > 0 ? messages : null,
    error,
    hasMore: rows.length === limit,
  };
}

export async function GetChatMessagesBefore(
  supabase: SupabaseClient,
  conversationId: string | number,
  beforeId: string | number,
  limit = CHAT_MESSAGES_PAGE_SIZE,
) {
  const { data, error } = await supabase
    .from("chat_message")
    .select("id, created_at, chat_conversation_id, role, content")
    .eq("chat_conversation_id", conversationId)
    .lt("id", beforeId)
    .order("id", { ascending: false })
    .limit(limit);

  const rows = (data ?? []) as ChatMessageRow[];
  const messages = mapRows(rows).reverse();

  return {
    data: messages.length > 0 ? messages : null,
    error,
    hasMore: rows.length === limit,
  };
}

export async function CreateChatMessage(
  conversationId: string | number,
  content: string,
) {
  const supabase = createClient();
  const { error } = await supabase.from("chat_message").insert({
    chat_conversation_id: conversationId,
    role: "user",
    content,
  });

  return { error };
}

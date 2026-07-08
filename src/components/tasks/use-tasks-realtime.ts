"use client";

import { useEffect } from "react";
import type { Task } from "@/components/tasks/types";
import { mapTask, type TaskRow } from "@/lib/lib-task";
import { createClient } from "@/lib/supabase/client";

type TasksRealtimeHandlers = {
  onTaskInserted: (task: Task) => void;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
};

export function useTasksRealtime(
  companyId: string | null,
  handlers: TasksRealtimeHandlers,
) {
  const { onTaskInserted, onTaskUpdated, onTaskDeleted } = handlers;

  useEffect(() => {
    if (!companyId) return;

    const supabase = createClient();
    let isMounted = true;

    const channel = supabase
      .channel(`tasks:${companyId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "task",
          filter: `company_id=eq.${companyId}`,
        },
        (payload) => {
          if (!isMounted) return;
          onTaskInserted(mapTask(payload.new as TaskRow));
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "task",
          filter: `company_id=eq.${companyId}`,
        },
        (payload) => {
          if (!isMounted) return;
          onTaskUpdated(mapTask(payload.new as TaskRow));
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "task",
          filter: `company_id=eq.${companyId}`,
        },
        (payload) => {
          if (!isMounted) return;
          const deletedId = String((payload.old as TaskRow).id);
          onTaskDeleted(deletedId);
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [companyId, onTaskDeleted, onTaskInserted, onTaskUpdated]);
}

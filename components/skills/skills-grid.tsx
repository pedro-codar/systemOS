"use client";

import { Plus, Zap } from "lucide-react";
import { useState } from "react";
import { CreateSkillModal } from "./create-skill-modal";
import { SkillCard } from "./skill-card";
import type { NewSkillData, Skill } from "./types";

const INITIAL_SKILLS: Skill[] = [
  {
    id: "1",
    name: "Resumir reunião",
    trigger: "resumir-reuniao",
    prompt:
      "Analise as notas da reunião fornecidas pelo usuário. Gere um resumo estruturado com: participantes, principais tópicos discutidos, decisões tomadas, ações pendentes com responsáveis e prazos. Use linguagem objetiva e profissional.",
    createdAt: "2026-06-15",
  },
  {
    id: "2",
    name: "Criar tarefa rápida",
    trigger: "criar-tarefa",
    prompt:
      "Com base na descrição do usuário, crie uma tarefa com título claro, descrição detalhada e prazo sugerido. Confirme os dados antes de registrar. Priorize verbos de ação no título.",
    createdAt: "2026-06-20",
  },
];

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export function SkillsGrid() {
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  function handleCreate(data: NewSkillData) {
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: data.name,
      trigger: data.trigger,
      prompt: data.prompt,
      createdAt: formatDate(new Date()),
    };
    setSkills((prev) => [newSkill, ...prev]);
  }

  return (
    <>
      <div className="flex h-full flex-col gap-6">
        <div className="flex shrink-0 items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            {skills.length} {skills.length === 1 ? "skill" : "skills"}
          </p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Plus className="size-4" />
            Nova skill
          </button>
        </div>

        {skills.length === 0 ? (
          <div className="border-border flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-12 text-center">
            <div className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-2xl">
              <Zap className="size-7" />
            </div>
            <div>
              <p className="text-foreground mb-1 text-sm font-medium">Nenhuma skill criada</p>
              <p className="text-muted-foreground max-w-sm text-sm">
                Crie skills para ensinar o assistente a executar tarefas específicas no chat.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
            >
              <Plus className="size-4" />
              Criar primeira skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-2 sm:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>

      <CreateSkillModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
}

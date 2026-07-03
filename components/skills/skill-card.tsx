"use client";

import { Zap } from "lucide-react";
import type { Skill } from "./types";

type SkillCardProps = {
  skill: Skill;
};

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <article className="border-border bg-popover hover:border-foreground/20 group flex flex-col rounded-xl border p-5 transition-all hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
          <Zap className="size-5" />
        </div>
        <span className="bg-muted text-muted-foreground inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs">
          /{skill.trigger}
        </span>
      </div>

      <h3 className="text-foreground mb-2 line-clamp-2 text-sm font-semibold leading-snug">
        {skill.name}
      </h3>

      <p className="text-muted-foreground line-clamp-4 flex-1 text-xs leading-relaxed">
        {skill.prompt}
      </p>
    </article>
  );
}

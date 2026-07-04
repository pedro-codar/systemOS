import type { KnowledgeCategory } from "./types";
import { getCategoryContentLabel } from "./types";

type KnowledgeCardProps = {
  category: KnowledgeCategory;
  content?: string;
  onClick: () => void;
};

export function KnowledgeCard({ category, content, onClick }: KnowledgeCardProps) {
  const contentLabel = getCategoryContentLabel(content);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group border-border/80 bg-popover/75 hover:border-primary/45 hover:shadow-primary/20 relative w-36 cursor-pointer overflow-hidden rounded-xl border px-4 py-3 text-left shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
    >
      <span className="from-primary/50 via-foreground/20 to-primary/50 absolute inset-x-3 top-0 h-px bg-gradient-to-r opacity-80" />
      <span className="bg-primary absolute top-3 bottom-3 left-0 w-0.5 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start gap-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-foreground group-hover:text-primary truncate text-sm font-semibold tracking-wide transition-colors duration-300">
            {category.name}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            <span className="bg-muted-foreground/15 text-muted-foreground inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium">
              {contentLabel}
            </span>
          </p>
        </div>
      </div>
    </button>
  );
}

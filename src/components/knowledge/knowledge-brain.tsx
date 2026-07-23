"use client";

import { useAppContext } from "@/context/app-context";
import { triggerEmbedding } from "@/actions/knowledge";
import {
  CreateKnowledgeCategory,
  DeleteKnowledgeCategory,
} from "@/lib/lib-knowledge-category";
import {
  DeleteCompanyDocument,
  UploadCompanyDocument,
} from "@/lib/lib-company-documents";
import {
  CreateKnowledgeEntrie,
  UpdateKnowledgeEntrie,
} from "@/lib/lib-knowledge-entries";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { KnowledgeCard } from "./knowledge-card";
import { KnowledgeCategoryDetailModal } from "./knowledge-category-detail-modal";
import { KnowledgeCategoryModal } from "./knowledge-category-modal";
import { KnowledgeHub } from "./knowledge-hub";
import type { KnowledgeCategory, NewCategoryData } from "./types";
const ADD_BUTTON_TARGET_ANGLE = 180;
const CARD_WIDTH = 144;
const CARD_HEIGHT = 64;
const CANVAS_PADDING = 48;
const HUB_HALF_WIDTH = 128;
const HUB_HALF_HEIGHT = 92;
const CONNECTOR_GAP = 16;
const ADD_BUTTON_RADIUS = 40;

type KnowledgeBrainProps = {
  initialCategories: KnowledgeCategory[];
  initialEntryContent: Record<string, string>;
  initialEntryIds: Record<string, string>;
  initialEntryPdfUrls: Record<string, string>;
};

function normalizeAngle(angle: number) {  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function angleDistance(a: number, b: number) {
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return Math.min(diff, 360 - diff);
}

function polarToPosition(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  };
}

function getHubRadiusAtAngle(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));

  if (cos < 1e-6) return HUB_HALF_HEIGHT;
  if (sin < 1e-6) return HUB_HALF_WIDTH;

  return Math.min(HUB_HALF_WIDTH / cos, HUB_HALF_HEIGHT / sin);
}

function getCardConnectorInset(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return (
    (CARD_WIDTH / 2) * Math.abs(Math.cos(rad)) +
    (CARD_HEIGHT / 2) * Math.abs(Math.sin(rad))
  );
}

function getMinOrbitRadiusAtAngle(angleDeg: number, targetInset: number) {
  return getHubRadiusAtAngle(angleDeg) + targetInset + CONNECTOR_GAP;
}

function getConnectorPoints(angleDeg: number, orbitRadius: number, targetInset: number) {
  const hubEdge = getHubRadiusAtAngle(angleDeg);
  const start = polarToPosition(angleDeg, hubEdge);
  const end = polarToPosition(
    angleDeg,
    Math.max(hubEdge + 8, orbitRadius - targetInset),
  );
  return { start, end };
}

function getOrbitRadiusAtAngle(
  angleDeg: number,
  targetInset: number,
  spacingRadius: number,
) {
  const clearanceRadius = getMinOrbitRadiusAtAngle(angleDeg, targetInset);
  return Math.max(clearanceRadius, spacingRadius + 24);
}

function computeLayout(cardCount: number) {
  if (cardCount === 0) {
    const addAngle = ADD_BUTTON_TARGET_ANGLE;
    const addOrbitRadius = getMinOrbitRadiusAtAngle(addAngle, ADD_BUTTON_RADIUS);
    const canvasSize =
      2 * (addOrbitRadius + Math.max(CARD_WIDTH, CARD_HEIGHT) / 2 + CANVAS_PADDING);

    return {
      cardAngles: [] as number[],
      cardOrbitRadii: [] as number[],
      addAngle,
      addOrbitRadius,
      canvasSize,
    };
  }

  const totalSlots = cardCount + 1;
  const step = 360 / totalSlots;
  const slotAngles = Array.from({ length: totalSlots }, (_, index) => -90 + step * index);

  const addSlotIndex = slotAngles.reduce((closestIndex, angle, index, angles) => {
    const currentDistance = angleDistance(angle, ADD_BUTTON_TARGET_ANGLE);
    const closestDistance = angleDistance(angles[closestIndex], ADD_BUTTON_TARGET_ANGLE);
    return currentDistance < closestDistance ? index : closestIndex;
  }, 0);

  const addAngle = slotAngles[addSlotIndex];
  const cardAngles = slotAngles.filter((_, index) => index !== addSlotIndex);

  const stepRad = (step * Math.PI) / 180;
  const spacingRadius = CARD_WIDTH / (2 * Math.sin(stepRad / 2));

  const cardOrbitRadii = cardAngles.map((angle) =>
    getOrbitRadiusAtAngle(angle, getCardConnectorInset(angle), spacingRadius),
  );
  const addOrbitRadius = getOrbitRadiusAtAngle(addAngle, ADD_BUTTON_RADIUS, spacingRadius);

  const maxRadius = Math.max(0, ...cardOrbitRadii, addOrbitRadius);
  const canvasSize = 2 * (maxRadius + Math.max(CARD_WIDTH, CARD_HEIGHT) / 2 + CANVAS_PADDING);

  return { cardAngles, cardOrbitRadii, addAngle, addOrbitRadius, canvasSize };
}

type ConnectorLineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

function ConnectorLine({ x1, y1, x2, y2 }: ConnectorLineProps) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeDasharray="5 7"
      strokeLinecap="round"
      className="text-primary/60"
    />
  );
}

export function KnowledgeBrain({
  initialCategories,
  initialEntryContent,
  initialEntryIds,
  initialEntryPdfUrls,
}: KnowledgeBrainProps) {
  const router = useRouter();
  const { companyId, company } = useAppContext();
  const [categories, setCategories] = useState(initialCategories);
  const [categoryContent, setCategoryContent] = useState(initialEntryContent);
  const [entryIds, setEntryIds] = useState(initialEntryIds);
  const [entryPdfUrls, setEntryPdfUrls] = useState(initialEntryPdfUrls);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    setCategoryContent(initialEntryContent);
    setEntryIds(initialEntryIds);
    setEntryPdfUrls(initialEntryPdfUrls);
  }, [initialEntryContent, initialEntryIds, initialEntryPdfUrls]);

  const layout = useMemo(() => computeLayout(categories.length), [categories.length]);
  const center = layout.canvasSize / 2;

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const selectedCategoryContent = selectedCategory
    ? categoryContent[selectedCategory.id] ?? ""
    : "";

  const selectedCategoryPdfUrl = selectedCategory
    ? entryPdfUrls[selectedCategory.id] ?? null
    : null;

  const cardPositions = useMemo(
    () =>
      categories.map((category, index) => {
        const angle = layout.cardAngles[index];
        const orbitRadius = layout.cardOrbitRadii[index];

        return {
          category,
          angle,
          orbitRadius,
          ...polarToPosition(angle, orbitRadius),
        };
      }),
    [categories, layout.cardAngles, layout.cardOrbitRadii],
  );
  const addButtonPosition = polarToPosition(layout.addAngle, layout.addOrbitRadius);

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleOpenCategoryDetail = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const handleCloseCategoryDetail = useCallback(() => {
    setSelectedCategoryId(null);
  }, []);

  const handleSaveCategory = useCallback(
    async (data: NewCategoryData) => {
      if (!companyId) {
        toast.error("Empresa não encontrada.");
        return;
      }

      const { data: category, error } = await CreateKnowledgeCategory(
        data.name,
        data.description,
        companyId,
        data.context_format,
      );

      if (error || !category) {
        toast.error("Não foi possível criar a categoria.");
        return;
      }

      toast.success("Categoria criada com sucesso.");
      router.refresh();
    },
    [companyId, router],
  );

  const handleSaveContent = useCallback(
    async (categoryId: string, content: string): Promise<boolean> => {
      if (!companyId) {
        toast.error("Empresa não encontrada.");
        return false;
      }

      const existingEntryId = entryIds[categoryId];
      const updatedAt = new Date();

      if (existingEntryId) {
        const { error } = await UpdateKnowledgeEntrie(existingEntryId, content, updatedAt);

        if (error) {
          toast.error("Não foi possível salvar o conteúdo.");
          return false;
        }

        const embeddingResult = await triggerEmbedding(Number(existingEntryId), "text");
        if (embeddingResult?.error) {
          toast.warning("Conteúdo salvo, mas a indexação falhou.");
        } else {
          toast.success("Conteúdo salvo com sucesso.");
        }
      } else {
        const stripped = content.replace(/<[^>]*>/g, "").trim();
        if (!stripped) return true;

        const { data, error } = await CreateKnowledgeEntrie(
          companyId,
          categoryId,
          content,
          updatedAt,
        );

        if (error || !data) {
          toast.error("Não foi possível salvar o conteúdo.");
          return false;
        }

        setEntryIds((prev) => ({ ...prev, [categoryId]: String(data.id) }));

        const embeddingResult = await triggerEmbedding(data.id, "text");
        if (embeddingResult?.error) {
          toast.warning("Conteúdo salvo, mas a indexação falhou.");
        } else {
          toast.success("Conteúdo salvo com sucesso.");
        }
      }

      setCategoryContent((prev) => ({ ...prev, [categoryId]: content }));
      router.refresh();
      return true;
    },
    [companyId, entryIds, router],
  );

  const handleSavePdf = useCallback(
    async (categoryId: string, file: File): Promise<boolean> => {
      if (!companyId) {
        toast.error("Empresa não encontrada.");
        return false;
      }

      const { path, error: uploadError } = await UploadCompanyDocument(
        companyId,
        categoryId,
        file,
      );

      if (uploadError || !path) {
        toast.error("Não foi possível enviar o PDF.");
        return false;
      }

      const existingEntryId = entryIds[categoryId];
      const previousPdfPath = entryPdfUrls[categoryId];
      const updatedAt = new Date();

      if (existingEntryId) {
        const { error } = await UpdateKnowledgeEntrie(
          existingEntryId,
          "",
          updatedAt,
          path,
        );

        if (error) {
          await DeleteCompanyDocument(path);
          toast.error("Não foi possível salvar o documento.");
          return false;
        }

        if (previousPdfPath && previousPdfPath !== path) {
          await DeleteCompanyDocument(previousPdfPath);
        }

        const embeddingResult = await triggerEmbedding(Number(existingEntryId), "pdf");
        if (embeddingResult?.error) {
          toast.warning("Documento salvo, mas a indexação falhou.");
        } else {
          toast.success("Documento salvo com sucesso.");
        }
      } else {
        const { data, error } = await CreateKnowledgeEntrie(
          companyId,
          categoryId,
          "",
          updatedAt,
          path,
        );

        if (error || !data) {
          await DeleteCompanyDocument(path);
          toast.error("Não foi possível salvar o documento.");
          return false;
        }

        setEntryIds((prev) => ({ ...prev, [categoryId]: String(data.id) }));

        const embeddingResult = await triggerEmbedding(data.id, "pdf");
        if (embeddingResult?.error) {
          toast.warning("Documento salvo, mas a indexação falhou.");
        } else {
          toast.success("Documento salvo com sucesso.");
        }
      }

      setEntryPdfUrls((prev) => ({ ...prev, [categoryId]: path }));
      router.refresh();
      return true;
    },
    [companyId, entryIds, entryPdfUrls, router],
  );

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      const pdfPath = entryPdfUrls[categoryId];
      const { error } = await DeleteKnowledgeCategory(categoryId);

      if (error) {
        toast.error("Não foi possível excluir a categoria.");
        return;
      }

      if (pdfPath) {
        await DeleteCompanyDocument(pdfPath);
      }

      setCategoryContent((prev) => {
        const next = { ...prev };
        delete next[categoryId];
        return next;
      });
      setEntryIds((prev) => {
        const next = { ...prev };
        delete next[categoryId];
        return next;
      });
      setEntryPdfUrls((prev) => {
        const next = { ...prev };
        delete next[categoryId];
        return next;
      });
      setSelectedCategoryId(null);
      toast.success("Categoria excluída com sucesso.");
      router.refresh();
    },
    [entryPdfUrls, router],
  );
  return (
    <>
      <KnowledgeCategoryModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveCategory}
      />

      <KnowledgeCategoryDetailModal
        category={selectedCategory}
        content={selectedCategoryContent}
        pdfUrl={selectedCategoryPdfUrl}
        onClose={handleCloseCategoryDetail}
        onSaveContent={handleSaveContent}
        onSavePdf={handleSavePdf}
        onDeleteCategory={handleDeleteCategory}
      />
    <div className="border-primary/15 shadow-primary/5 relative h-full min-h-0 w-full flex-1 overflow-auto rounded-2xl border shadow-inner">
      <div
        className="relative overflow-hidden"
        style={{
          width: `max(100%, ${layout.canvasSize}px)`,
          height: `max(100%, ${layout.canvasSize}px)`,
          minHeight: "100%",
          minWidth: "100%",
        }}
      >
        <div aria-hidden className="bg-popover/50 pointer-events-none absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, var(--foreground) 0.6px, transparent 0.6px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse farthest-corner at center, var(--primary) 0%, transparent 65%)",
            opacity: 0.22,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse farthest-corner at center, transparent 45%, var(--background) 100%)",
            opacity: 0.45,
          }}
        />

        <div className="relative flex h-full w-full items-center justify-center">
          <div
            className="relative shrink-0 transition-[width,height] duration-300 ease-out"
            style={{ width: layout.canvasSize, height: layout.canvasSize }}
          >
            <svg
              viewBox={`0 0 ${layout.canvasSize} ${layout.canvasSize}`}
              className="text-primary pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
              aria-hidden
            >
              {cardPositions.map(({ category, angle, orbitRadius }) => {
                const { start, end } = getConnectorPoints(
                  angle,
                  orbitRadius,
                  getCardConnectorInset(angle),
                );

                return (
                  <ConnectorLine
                    key={category.id}                    x1={center + start.x}
                    y1={center + start.y}
                    x2={center + end.x}
                    y2={center + end.y}
                  />
                );
              })}

              {(() => {
                const { start, end } = getConnectorPoints(
                  layout.addAngle,
                  layout.addOrbitRadius,
                  ADD_BUTTON_RADIUS,
                );

                return (
                  <ConnectorLine
                    x1={center + start.x}
                    y1={center + start.y}
                    x2={center + end.x}
                    y2={center + end.y}
                  />
                );
              })()}
            </svg>

            <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <KnowledgeHub companyName={company?.name ?? "Sua empresa"} />
            </div>
            {cardPositions.map(({ category, x, y }) => (
              <div
                key={category.id}
                className="absolute top-1/2 left-1/2 z-10 transition-transform duration-300 ease-out"
                style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
              >
                <KnowledgeCard
                  category={category}
                  content={categoryContent[category.id]}
                  pdfUrl={entryPdfUrls[category.id]}
                  onClick={() => handleOpenCategoryDetail(category.id)}
                />
              </div>
            ))}
            <div
              className="absolute top-1/2 left-1/2 z-10 transition-transform duration-300 ease-out"
              style={{
                transform: `translate(calc(-50% + ${addButtonPosition.x}px), calc(-50% + ${addButtonPosition.y}px))`,
              }}
            >
              <div className="relative">
                <div
                  aria-hidden
                  className="border-primary/30 knowledge-ring-pulse absolute -inset-1 rounded-full border border-dashed"
                />
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="border-primary/35 bg-popover/70 text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground group relative flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full border border-dashed shadow-lg shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
                >
                  <Plus
                    className="size-4 transition-transform duration-300 group-hover:rotate-90"
                    strokeWidth={2}
                  />
                  <span className="mt-0.5 flex items-center gap-0.5 text-[11px] font-semibold">
                    Nova
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

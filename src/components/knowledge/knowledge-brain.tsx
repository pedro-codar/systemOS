"use client";

import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { KnowledgeCard } from "./knowledge-card";
import { KnowledgeCategoryDetailModal } from "./knowledge-category-detail-modal";
import { KnowledgeCategoryModal } from "./knowledge-category-modal";
import { KnowledgeHub } from "./knowledge-hub";
import type { KnowledgeCardData, NewCategoryData, NewInformationData } from "./types";

const ADD_BUTTON_TARGET_ANGLE = 180;
const CARD_WIDTH = 144;
const CARD_HEIGHT = 64;
const CANVAS_PADDING = 48;
const HUB_HALF_WIDTH = 128;
const HUB_HALF_HEIGHT = 92;
const CONNECTOR_GAP = 16;
const ADD_BUTTON_RADIUS = 40;

const INITIAL_CARDS: KnowledgeCardData[] = [
  {
    id: "1",
    title: "FORNECEDORES",
    description: "Todos os fornecedores, contatos e condições de pagamento.",
    informations: [
      {
        id: "i1",
        title: "Gráfica Norte — fornecedor de papel",
        description:
          "Contato: João Silva — joao@graficanorte.com — (11) 99999-9999. Entrega toda terça-feira. Pedido mínimo R$500. Pagamento em 30 dias. Bom para pedidos urgentes, ligar direto.",
      },
      {
        id: "i2",
        title: "TechParts Ltda — componentes eletrônicos",
        description:
          "Contato: Maria Santos — maria@techparts.com.br — (11) 98888-8888. Entrega em 5 dias úteis. Pagamento à vista com 5% de desconto.",
      },
    ],
  },
  {
    id: "2",
    title: "Cultura",
    description: "Valores, missão e cultura organizacional.",
    informations: [],
  },
  {
    id: "3",
    title: "marketing",
    description: "Estratégias, campanhas e materiais de marketing.",
    informations: [],
  },
];

function normalizeAngle(angle: number) {
  const normalized = angle % 360;
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

export function KnowledgeBrain() {
  const [cards, setCards] = useState<KnowledgeCardData[]>(INITIAL_CARDS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const layout = useMemo(() => computeLayout(cards.length), [cards.length]);
  const center = layout.canvasSize / 2;

  const selectedCategory = useMemo(
    () => cards.find((card) => card.id === selectedCategoryId) ?? null,
    [cards, selectedCategoryId],
  );

  const cardPositions = useMemo(
    () =>
      cards.map((card, index) => {
        const angle = layout.cardAngles[index];
        const orbitRadius = layout.cardOrbitRadii[index];

        return {
          card,
          angle,
          orbitRadius,
          ...polarToPosition(angle, orbitRadius),
        };
      }),
    [cards, layout.cardAngles, layout.cardOrbitRadii],
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

  const handleSaveCategory = useCallback((data: NewCategoryData) => {
    setCards((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        informations: [],
      },
    ]);
  }, []);

  const handleAddInformation = useCallback(
    (categoryId: string, data: NewInformationData) => {
      setCards((prev) =>
        prev.map((card) =>
          card.id === categoryId
            ? {
                ...card,
                informations: [
                  ...card.informations,
                  {
                    id: crypto.randomUUID(),
                    title: data.title,
                    description: data.description,
                  },
                ],
              }
            : card,
        ),
      );
    },
    [],
  );

  const handleDeleteInformation = useCallback(
    (categoryId: string, informationId: string) => {
      setCards((prev) =>
        prev.map((card) =>
          card.id === categoryId
            ? {
                ...card,
                informations: card.informations.filter(
                  (information) => information.id !== informationId,
                ),
              }
            : card,
        ),
      );
    },
    [],
  );

  const handleDeleteCategory = useCallback((categoryId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== categoryId));
    setSelectedCategoryId(null);
  }, []);

  return (
    <>
      <KnowledgeCategoryModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveCategory}
      />

      <KnowledgeCategoryDetailModal
        category={selectedCategory}
        onClose={handleCloseCategoryDetail}
        onAddInformation={handleAddInformation}
        onDeleteInformation={handleDeleteInformation}
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
              {cardPositions.map(({ card, angle, orbitRadius }) => {
                const { start, end } = getConnectorPoints(
                  angle,
                  orbitRadius,
                  getCardConnectorInset(angle),
                );

                return (
                  <ConnectorLine
                    key={card.id}
                    x1={center + start.x}
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
              <KnowledgeHub />
            </div>

            {cardPositions.map(({ card, x, y }) => (
              <div
                key={card.id}
                className="absolute top-1/2 left-1/2 z-10 transition-transform duration-300 ease-out"
                style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
              >
                <KnowledgeCard
                  card={card}
                  onClick={() => handleOpenCategoryDetail(card.id)}
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

"use client";

import { Check, Loader2, Plus, Search } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { CollaboratorArea } from "./types";

type AreaSearchSelectProps = {
  areas: CollaboratorArea[];
  value: CollaboratorArea | null;
  onChange: (area: CollaboratorArea | null) => void;
  onCreateArea: (name: string) => Promise<CollaboratorArea | null>;
  disabled?: boolean;
};

function normalizeText(text: string) {
  return text.trim().toLowerCase();
}

export function AreaSearchSelect({
  areas,
  value,
  onChange,
  onCreateArea,
  disabled = false,
}: AreaSearchSelectProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const normalizedQuery = normalizeText(query);
  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(normalizedQuery),
  );
  const exactMatch = areas.some(
    (area) => normalizeText(area.name) === normalizedQuery,
  );
  const canCreate =
    normalizedQuery.length > 0 &&
    !exactMatch &&
    !filteredAreas.some((area) => normalizeText(area.name) === normalizedQuery);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        if (value) setQuery(value.name);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [value]);

  function handleSelect(area: CollaboratorArea) {
    onChange(area);
    setQuery(area.name);
    setIsOpen(false);
  }

  async function handleCreate() {
    const name = query.trim();
    if (!name || isCreating || disabled) return;

    setIsCreating(true);
    const newArea = await onCreateArea(name);
    setIsCreating(false);

    if (newArea) {
      handleSelect(newArea);
    }
  }

  function handleInputChange(nextQuery: string) {
    setQuery(nextQuery);
    setIsOpen(true);

    if (value && normalizeText(nextQuery) !== normalizeText(value.name)) {
      onChange(null);
    }
  }

  function handleFocus() {
    if (disabled) return;
    setIsOpen(true);
    if (value) setQuery("");
  }

  function handleBlurRelated() {
    if (value) {
      setQuery(value.name);
    }
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      <label htmlFor={`${listboxId}-input`} className="text-foreground text-sm font-medium">
        Área
      </label>

      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <input
          ref={inputRef}
          id={`${listboxId}-input`}
          type="text"
          value={query}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlurRelated}
          placeholder="Buscar ou criar área..."
          autoComplete="off"
          disabled={disabled || isCreating}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-xl border py-3 pr-4 pl-10 text-sm outline-none transition-colors focus:ring-2"
        />

        {isOpen && !disabled && (filteredAreas.length > 0 || canCreate) && (
          <ul
            id={listboxId}
            role="listbox"
            className="border-border bg-popover absolute top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border py-1 shadow-lg shadow-black/20"
          >
            {filteredAreas.map((area) => {
              const isSelected = value?.id === area.id;

              return (
                <li key={area.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(area)}
                    className="text-foreground hover:bg-muted flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors"
                  >
                    <span>{area.name}</span>
                    {isSelected && <Check className="text-primary size-4 shrink-0" />}
                  </button>
                </li>
              );
            })}

            {canCreate && (
              <li role="option" aria-selected={false}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="text-primary hover:bg-muted disabled:opacity-50 flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium transition-colors"
                >
                  {isCreating ? (
                    <Loader2 className="size-4 shrink-0 animate-spin" />
                  ) : (
                    <Plus className="size-4 shrink-0" />
                  )}
                  <span>
                    {isCreating ? "Criando área..." : `Criar área "${query.trim()}"`}
                  </span>
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      {!value && query.trim() === "" && (
        <p className="text-muted-foreground text-xs">
          Digite para buscar uma área existente ou criar uma nova.
        </p>
      )}
    </div>
  );
}

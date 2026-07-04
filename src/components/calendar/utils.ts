export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseEventDate(startsAt: string) {
  return new Date(startsAt);
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isEventToday(startsAt: string) {
  return isSameDay(parseEventDate(startsAt), new Date());
}

export function isEventPast(startsAt: string) {
  return parseEventDate(startsAt).getTime() < Date.now();
}

export function isEventSoon(startsAt: string) {
  const eventTime = parseEventDate(startsAt).getTime();
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  return eventTime >= now && eventTime - now <= dayMs;
}

export function formatEventTime(startsAt: string) {
  return parseEventDate(startsAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatEventDay(startsAt: string) {
  return parseEventDate(startsAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
  });
}

export function formatEventMonth(startsAt: string) {
  return parseEventDate(startsAt).toLocaleDateString("pt-BR", {
    month: "short",
  }).replace(".", "");
}

export function formatEventWeekday(startsAt: string) {
  return parseEventDate(startsAt).toLocaleDateString("pt-BR", {
    weekday: "short",
  }).replace(".", "");
}

export function formatEventDateLong(startsAt: string) {
  return parseEventDate(startsAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatFullDateTime(startsAt: string) {
  return parseEventDate(startsAt).toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCreatedAt(isoDate: string) {
  const date = new Date(isoDate + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export type EventStatus = "today" | "soon" | "scheduled" | "past";

export function getEventStatus(startsAt: string): EventStatus {
  if (isEventPast(startsAt)) return "past";
  if (isEventToday(startsAt)) return "today";
  if (isEventSoon(startsAt)) return "soon";
  return "scheduled";
}

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  today: "Hoje",
  soon: "Em breve",
  scheduled: "Agendado",
  past: "Encerrado",
};

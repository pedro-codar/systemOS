export function formatDeadline(isoDate: string) {
  const date = new Date(isoDate + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatFullDate(isoDate: string) {
  const date = new Date(isoDate + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function isDeadlineOverdue(isoDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(isoDate + "T12:00:00");
  return deadline < today;
}

export function isDeadlineSoon(isoDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(isoDate + "T12:00:00");
  const diffDays = (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 3;
}

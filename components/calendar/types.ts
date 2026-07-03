export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  createdAt: string;
};

export type NewEventData = {
  title: string;
  description: string;
  startsAt: string;
};

export type EventFilter = "all" | "upcoming" | "today" | "past";

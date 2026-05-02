export type EventAgendaItem = {
  title: string;
  description: string;
  duration: string;
};

export type EventHost = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

export type EventJoinInfo = {
  title: string;
  description: string;
  platform: string;
  duration: string;
  recording: string;
};

export type EventSidebarAction = {
  label: string;
  href?: string;
  variant?: "primary" | "gold" | "outline" | "danger";
};

export type EventReviewData = {
  eventId: number;
  slug: string;
  isRegistered: boolean;
  category: string;
  status: string;
  registrationLabel: string;
  countdown: string;
  title: string;
  summary: string;
  date: string;
  time: string;
  mode: string;
  heroImage: string;
  about: string[];
  agenda: EventAgendaItem[];
  host: EventHost;
  joinInfo: EventJoinInfo;
  details: {
    attendees: string;
    duration: string;
    language: string;
    level: string;
  };
  sidebarActions: EventSidebarAction[];
  communityCard: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref?: string;
  };
};

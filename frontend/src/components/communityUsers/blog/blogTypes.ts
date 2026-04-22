export type BlogStatus = "completed" | "continue_writing" | "waiting_review";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  status: BlogStatus;
  date: string;
  views: number;
  comments: number;
};

export type WritingActivity = {
  id: string;
  title: string;
  note: string;
  status: BlogStatus;
};

import type { Comment } from "@/types/comment";

export type TaskFile = {
  name: string;
  url: string; // Could be blob URL or base64
  type: string; // e.g., "image/png"
};

export type Task = {
  id: string;
  title: string;
  status: "Incoming" | "To do" | "In progress";
  description: string;
  assignee?: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  comments: Comment[];
  files: TaskFile[];
  tags: string[];
  priority: "low" | "medium" | "high";
  image?: string; // Optional since not all tasks have an image
};

export type TaskList = {
  Incoming: Task[];
  "To do": Task[];
  "In progress": Task[];
};

export type Comment = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string; // ISO date string
};

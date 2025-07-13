import { TAGS } from "@/mock/tags";
import { USERS } from "@/mock/users";
import type { TaskList } from "@/types/tasks";

export const SAMPLE_TASKS: TaskList = {
  Incoming: [
    {
      id: "1",
      status: "Incoming",
      title: "Improve cards readability",
      description:
        "Sint ex excepteur proident adipisicing adipisicing occaecat pariatur.",
      assignee: USERS[2],
      dueDate: "2022-03-15",
      comments: [
        {
          id: "c1",
          author: USERS[3],
          content: "This task needs better formatting!",
          createdAt: new Date().toISOString(),
        },
      ],
      files: [
        {
          name: "mock-image.jpg",
          url: "https://placehold.co/200x100?text=Image+File",
          type: "image/jpeg",
        },
      ],
      tags: [TAGS[0], TAGS[1]],
      priority: "high",
      image:
        " https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
    },
    {
      id: "2",
      status: "Incoming",
      title: "Need to check",
      description:
        "Sint ex excepteur proident adipisicing adipisicing occaecat pariatur.",
      assignee: USERS[3],
      dueDate: "2022-04-15",
      comments: [
        {
          id: "c2",
          author: USERS[4],
          content: "Let me know when ready.",
          createdAt: new Date().toISOString(),
        },
      ],
      files: [],
      tags: [TAGS[0], TAGS[1]],
      priority: "medium",
    },
  ],
  "To do": [
    {
      id: "3",
      status: "To do",
      title: "Need to check components",
      description:
        "Sint ex excepteur proident adipisicing adipisicing occaecat pariatur.",
      assignee: USERS[5],
      dueDate: "2022-03-15",
      comments: [
        {
          id: "c3",
          author: USERS[6],
          content: "Looks good so far.",
          createdAt: new Date().toISOString(),
        },
      ],
      files: [],
      tags: [TAGS[0], TAGS[1]],
      priority: "medium",
    },
    {
      id: "4",
      status: "To do",
      title: "Check design system",
      description:
        "Review and update the design system components for consistency.",
      assignee: USERS[7],
      dueDate: "2022-03-15",
      comments: [],
      files: [],
      tags: [TAGS[0]],
      priority: "low",
    },
  ],
  "In progress": [
    {
      id: "5",
      status: "In progress",
      title: "Something wrong",
      description:
        "Sint ex excepteur proident adipisicing adipisicing occaecat pariatur.",
      assignee: USERS[8],
      dueDate: "2022-04-15",
      comments: [
        {
          id: "c5",
          author: USERS[9],
          content: "Found a bug here.",
          createdAt: new Date().toISOString(),
        },
      ],
      files: [],
      tags: [TAGS[1]],
      priority: "high",
    },
    {
      id: "6",
      status: "In progress",
      title: "Need more info",
      description:
        "Gather additional requirements and specifications for the project.",
      assignee: USERS[10],
      dueDate: "2022-03-15",
      comments: [
        {
          id: "c6",
          author: USERS[8],
          content: "Please clarify scope.",
          createdAt: new Date().toISOString(),
        },
      ],
      files: [],
      tags: [TAGS[2]],
      priority: "medium",
      image:
        " https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
    },
  ],
};

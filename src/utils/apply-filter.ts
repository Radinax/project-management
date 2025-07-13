import type { TaskList } from "@/types/tasks";

export const applyFilter = (
  taskList: TaskList,
  searchTerm: string
): TaskList => {
  if (!searchTerm.trim()) return taskList;

  return Object.entries(taskList).reduce<TaskList>(
    (acc, [column, tasks]) => {
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      acc[column as keyof TaskList] = filtered;
      return acc;
    },
    {
      Incoming: [],
      "To do": [],
      "In progress": [],
    }
  );
};

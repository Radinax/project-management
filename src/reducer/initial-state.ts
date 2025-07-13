import { SAMPLE_TASKS } from "@/mock/task-list";
import type { TaskState } from "@/reducer/types";
import type { TaskList } from "@/types/tasks";

export const initialState: TaskState = {
  originalTasks: SAMPLE_TASKS,
  currentTasks: SAMPLE_TASKS,
  filteredTasks: SAMPLE_TASKS,
  searchTerm: "",
  columnOrder: Object.keys(SAMPLE_TASKS) as (keyof TaskList)[],
};

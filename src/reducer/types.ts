import type { TaskList, Task } from "@/types/tasks";
import { type Comment } from "@/types/comment";

export type TaskAction =
  | { type: "ADD_COLUMN" }
  | {
      type: "RENAME_COLUMN";
      payload: { oldName: string; newName: string };
    }
  | { type: "REMOVE_COLUMN"; payload: { columnName: keyof TaskList } }
  | { type: "ADD_TASK"; payload: { column: keyof TaskList; task: Task } }
  | { type: "REMOVE_TASK"; payload: { column: keyof TaskList; taskId: string } }
  | {
      type: "MOVE_TASK_AT_INDEX";
      payload: {
        from: keyof TaskList;
        to: keyof TaskList;
        taskId: string;
        index: number;
      };
    }
  | {
      type: "REORDER_COLUMNS";
      payload: { columnOrder: (keyof TaskList)[] };
    }
  | {
      type: "EDIT_TASK";
      payload: { column: keyof TaskList; task: Partial<Task> };
    }
  | { type: "UPDATE_TASK"; payload: { column: keyof TaskList; task: Task } }
  | { type: "RESET_TASKS"; payload: TaskList }
  | {
      type: "SET_SEARCH_TERM";
      payload: { tasklist: TaskList; searchTerm: string };
    }
  | { type: "APPLY_FILTER"; payload: TaskList }
  | {
      type: "ADD_COMMENT";
      payload: { column: keyof TaskList; taskId: string; comment: Comment };
    }
  | {
      type: "DELETE_COMMENT";
      payload: { column: keyof TaskList; taskId: string; commentId: string };
    }
  | {
      type: "EDIT_COMMENT";
      payload: {
        column: keyof TaskList;
        taskId: string;
        commentId: string;
        content: string;
      };
    };
export type TaskState = {
  originalTasks: TaskList; // never modified, used for reset only
  currentTasks: TaskList; // mutable version – reflects all user actions
  filteredTasks: TaskList; // filtered version of currentTasks
  searchTerm: string;
  columnOrder: (keyof TaskList)[];
};

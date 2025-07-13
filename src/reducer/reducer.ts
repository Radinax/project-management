import { initialState } from "@/reducer/initial-state";
import type { TaskState, TaskAction } from "@/reducer/types";
import type { TaskList } from "@/types/tasks";
import { applyFilter } from "@/utils/apply-filter";
import { useReducer } from "react";

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "ADD_COLUMN": {
      // Generate next column name based on current count
      const nextIndex = state.columnOrder.length + 1;
      const newColumnName = `column-${nextIndex}` as keyof TaskList;

      // Prevent duplicate columns
      if (state.currentTasks[newColumnName]) {
        return state;
      }

      // Add new empty column
      const updatedCurrent = {
        ...state.currentTasks,
        [newColumnName]: [],
      };

      // Update column order to include new column at the end
      const updatedColumnOrder = [...state.columnOrder, newColumnName];

      return {
        ...state,
        currentTasks: updatedCurrent,
        columnOrder: updatedColumnOrder,
        filteredTasks: applyFilter(updatedCurrent, state.searchTerm),
      };
    }
    case "RENAME_COLUMN": {
      const { oldName, newName } = action.payload;

      const newColName = newName.trim() as keyof TaskList;

      if (state.currentTasks[newColName] && newColName !== oldName) {
        return state;
      }

      // Get index of old column
      const updatedColumnOrder = [...state.columnOrder];
      const columnIndex = updatedColumnOrder.indexOf(oldName as keyof TaskList);
      if (columnIndex === -1) return state;

      // Get tasks and update their status
      const oldTasks = state.currentTasks[oldName as keyof TaskList];
      const updatedTasks = oldTasks.map((task) => ({
        ...task,
        status: newColName, // 👈 Update each task's status
      }));

      // Create new currentTasks object
      const updatedCurrent = { ...state.currentTasks };

      // Remove old column
      delete updatedCurrent[oldName as keyof TaskList];

      // Add new column with updated tasks
      updatedCurrent[newColName] = updatedTasks;

      // Update column order
      updatedColumnOrder[columnIndex] = newColName;

      return {
        ...state,
        currentTasks: updatedCurrent,
        columnOrder: updatedColumnOrder,
        filteredTasks: applyFilter(updatedCurrent, state.searchTerm),
      };
    }

    case "REMOVE_COLUMN": {
      const { columnName } = action.payload;

      // Create a copy of current task list
      const updatedCurrent = { ...state.currentTasks };

      // Delete the column
      delete updatedCurrent[columnName];

      // Remove column from columnOrder
      const updatedColumnOrder = state.columnOrder.filter(
        (col) => col !== columnName
      );

      return {
        ...state,
        currentTasks: updatedCurrent,
        columnOrder: updatedColumnOrder,
        filteredTasks: applyFilter(updatedCurrent, state.searchTerm),
      };
    }

    case "REORDER_COLUMNS": {
      const { columnOrder } = action.payload;

      return {
        ...state,
        columnOrder,
      };
    }

    case "ADD_TASK": {
      const { column, task } = action.payload;
      const updatedCurrent = {
        ...state.currentTasks,
        [column]: [...state.currentTasks[column], task],
      };
      return {
        ...state,
        currentTasks: updatedCurrent,
        filteredTasks: updatedCurrent, // reflect in filtered if no active search
      };
    }

    case "REMOVE_TASK": {
      const { column, taskId } = action.payload;
      const updatedCurrent = {
        ...state.currentTasks,
        [column]: state.currentTasks[column].filter((t) => t.id !== taskId),
      };
      return {
        ...state,
        currentTasks: updatedCurrent,
        filteredTasks: updatedCurrent,
      };
    }

    case "MOVE_TASK_AT_INDEX": {
      const { from, to, taskId, index } = action.payload;

      // Ensure both columns exist in columnOrder
      if (
        !state.columnOrder.includes(from) ||
        !state.columnOrder.includes(to)
      ) {
        return state;
      }

      const taskToMove = state.currentTasks[from].find((t) => t.id === taskId);
      if (!taskToMove) return state;

      const updatedTask = { ...taskToMove, status: to };

      // If moving within the same column
      if (from === to) {
        const column = [...state.currentTasks[from]];

        const oldIndex = column.findIndex((t) => t.id === taskId);
        if (oldIndex === -1 || oldIndex === index) return state;

        const [moved] = column.splice(oldIndex, 1);
        column.splice(index, 0, moved);

        const updatedCurrent = {
          ...state.currentTasks,
          [from]: column,
        };

        return {
          ...state,
          currentTasks: updatedCurrent,
          filteredTasks: state.searchTerm
            ? applyFilter(updatedCurrent, state.searchTerm)
            : updatedCurrent,
        };
      }

      // Moving between different columns
      const updatedFrom = state.currentTasks[from].filter(
        (t) => t.id !== taskId
      );
      const targetArray = [...state.currentTasks[to]];
      targetArray.splice(index, 0, updatedTask);

      const updatedCurrent = {
        ...state.currentTasks,
        [from]: updatedFrom,
        [to]: targetArray,
      };

      return {
        ...state,
        currentTasks: updatedCurrent,
        filteredTasks: state.searchTerm
          ? applyFilter(updatedCurrent, state.searchTerm)
          : updatedCurrent,
      };
    }

    case "EDIT_TASK": {
      const { column, task: updatedTaskFields } = action.payload;

      const updatedColumn = state.currentTasks[column].map((task) => {
        if (task.id === updatedTaskFields.id) {
          return {
            ...task,
            ...updatedTaskFields, // Merge new fields into existing task
          };
        }
        return task;
      });

      const updatedCurrentTasks = {
        ...state.currentTasks,
        [column]: updatedColumn,
      };

      return {
        ...state,
        currentTasks: updatedCurrentTasks,
        filteredTasks: state.searchTerm
          ? applyFilter(updatedCurrentTasks, state.searchTerm)
          : updatedCurrentTasks,
      };
    }

    case "SET_SEARCH_TERM": {
      const { searchTerm } = action.payload;

      if (!searchTerm.trim()) {
        // Restore filteredTasks to the current state (which includes all moves)
        return {
          ...state,
          searchTerm: "",
          filteredTasks: state.currentTasks,
        };
      }

      // Filter based on currentTasks (not original)
      const filteredTasks = Object.entries(state.currentTasks).reduce<TaskList>(
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

      return {
        ...state,
        searchTerm,
        filteredTasks,
      };
    }

    case "ADD_COMMENT": {
      const { column, taskId, comment } = action.payload;

      const updatedColumn = state.currentTasks[column].map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            comments: [...task.comments, comment],
          };
        }
        return task;
      });

      const updatedCurrentTasks = {
        ...state.currentTasks,
        [column]: updatedColumn,
      };

      return {
        ...state,
        currentTasks: updatedCurrentTasks,
        filteredTasks: state.searchTerm
          ? applyFilter(updatedCurrentTasks, state.searchTerm)
          : updatedCurrentTasks,
      };
    }

    case "DELETE_COMMENT": {
      const { column, taskId, commentId } = action.payload;

      const updatedColumn = state.currentTasks[column].map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            comments: task.comments.filter((c) => c.id !== commentId),
          };
        }
        return task;
      });

      const updatedCurrentTasks = {
        ...state.currentTasks,
        [column]: updatedColumn,
      };

      return {
        ...state,
        currentTasks: updatedCurrentTasks,
        filteredTasks: state.searchTerm
          ? applyFilter(updatedCurrentTasks, state.searchTerm)
          : updatedCurrentTasks,
      };
    }

    case "EDIT_COMMENT": {
      const { column, taskId, commentId, content } = action.payload;

      const updatedColumn = state.currentTasks[column].map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            comments: task.comments.map((c) =>
              c.id === commentId ? { ...c, content } : c
            ),
          };
        }
        return task;
      });

      const updatedCurrentTasks = {
        ...state.currentTasks,
        [column]: updatedColumn,
      };

      return {
        ...state,
        currentTasks: updatedCurrentTasks,
        filteredTasks: state.searchTerm
          ? applyFilter(updatedCurrentTasks, state.searchTerm)
          : updatedCurrentTasks,
      };
    }

    case "RESET_TASKS": {
      return {
        ...initialState,
      };
    }

    default:
      return state;
  }
};
export const useTaskReducer = () => {
  return useReducer(taskReducer, initialState);
};

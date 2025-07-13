import DraggableKanbanColumn from "@/components/draggable-kanban-column";
import FilterBar from "@/components/filter-bar";
import Header from "@/components/header";
import AppSidebar from "@/components/sidebar/sidebar";
import TaskCard from "@/components/task-card";
import TaskModal from "@/components/task-modal/task-modal";
import { useTaskReducer } from "@/reducer/reducer";
import type { Task, TaskList } from "@/types/tasks";
import {
  useSensors,
  useSensor,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
  DndContext,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { type Comment } from "@/types/comment";

function Dashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "calendar">(
    "kanban"
  );
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [state, dispatch] = useTaskReducer();

  const tasks = useMemo(() => {
    const { currentTasks, filteredTasks } = state;
    return filteredTasks ?? currentTasks;
  }, [state]);
  const searchTerm = useMemo(() => {
    return state.searchTerm;
  }, [state]);
  const progress = useMemo(() => {
    const { currentTasks, columnOrder } = state;

    // Determine which column to count as "in progress"
    let inProgressCount = 0;
    if (currentTasks["In progress"]) {
      inProgressCount = currentTasks["In progress"].length;
    } else {
      // Fall back to last column if "In progress" doesn't exist
      const lastColumn = columnOrder[columnOrder.length - 1];
      if (lastColumn && currentTasks[lastColumn]) {
        inProgressCount = currentTasks[lastColumn].length;
      }
    }

    // Calculate total number of tasks across all columns
    const totalTasks = Object.values(currentTasks).reduce(
      (sum, column) => sum + column.length,
      0
    );

    if (totalTasks === 0) return 0;

    const percentage = (inProgressCount / totalTasks) * 100;
    return Math.round(percentage);
  }, [state]);
  const onAddComment = (
    column: keyof TaskList,
    taskId: string,
    newComment: Comment
  ) => {
    dispatch({
      type: "ADD_COMMENT",
      payload: { column, taskId, comment: newComment },
    });

    // Immediately find the updated task from current state
    const updatedTask = state.currentTasks[column].find(
      (task) => task.id === taskId
    );

    // If found, update selected task
    if (updatedTask) {
      setSelectedTask(updatedTask);
    }
  };

  const memoizedActiveTask = useMemo(() => {
    return activeTask;
  }, [activeTask]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    dispatch({
      type: "SET_SEARCH_TERM",
      payload: { searchTerm, tasklist: tasks },
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleTaskClick = (taskId: string) => {
    const allTasks = Object.values(tasks).flat();
    const task = allTasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsTaskModalOpen(true);
    }
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const openTaskModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (column: keyof TaskList, taskData: Task) => {
    if (selectedTask) {
      dispatch({
        type: "EDIT_TASK",
        payload: { column, task: { ...selectedTask, ...taskData } },
      });
      setSelectedTask(null);
    } else {
      dispatch({ type: "ADD_TASK", payload: { column, task: taskData } });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const allTasks = Object.values(tasks).flat();
    const task = allTasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const moveTaskAtPosition = (
        from: keyof TaskList,
        to: keyof TaskList,
        taskId: string,
        index: number
      ) => {
        dispatch({
          type: "MOVE_TASK_AT_INDEX",
          payload: { from, to, taskId, index },
        });
      };

      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      // Check if we're dragging a column
      const columnNames = Object.keys(state.currentTasks) as (keyof TaskList)[];

      // ✅ Check if active.id is a known column name
      const isColumn = columnNames.includes(active.id as keyof TaskList);

      if (isColumn) {
        // 🧩 Handle column reordering
        const oldOrder = [...state.columnOrder];
        const oldIndex = oldOrder.indexOf(active.id as keyof TaskList);
        const newIndex = oldOrder.indexOf(over.id as keyof TaskList);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(oldOrder, oldIndex, newIndex);

          dispatch({
            type: "REORDER_COLUMNS",
            payload: { columnOrder: newOrder },
          });
        }

        return; // ✅ Exit early after handling column
      }

      // If we're here, it's a task drag
      const allTasks = Object.values(tasks).flat();
      const activeTask = allTasks.find((task) => task.id === active.id);

      if (!activeTask) return;

      let targetColumn: keyof TaskList | undefined = undefined;
      let targetIndex = -1;

      // Check if dropped on column header
      if (typeof over.id === "string" && over.id.startsWith("column-")) {
        targetColumn = over.id.replace("column-", "") as keyof TaskList;
        targetIndex = tasks[targetColumn]?.length || 0;
      } else {
        // Find column + index of target task
        for (const [columnName, columnTasks] of Object.entries(tasks)) {
          const idx = columnTasks.findIndex((task) => task.id === over.id);
          if (idx !== -1) {
            targetColumn = columnName as keyof TaskList;
            targetIndex = idx;
            break;
          }
        }
      }

      if (!targetColumn) return;

      const sourceColumn = activeTask.status;

      // Handle reorder inside same column
      if (sourceColumn === targetColumn) {
        const sourceIndex = tasks[sourceColumn].findIndex(
          (task) => task.id === active.id
        );

        if (sourceIndex === -1 || sourceIndex === targetIndex) return;

        moveTaskAtPosition(
          sourceColumn,
          targetColumn,
          active.id as string,
          targetIndex
        );
        return;
      }

      // Handle moving between columns
      moveTaskAtPosition(
        sourceColumn,
        targetColumn,
        active.id as string,
        targetIndex
      );
    },
    [dispatch, state.columnOrder, state.currentTasks, tasks]
  );

  const onClickSearch = (taskId: string) => {
    const allTasks = Object.values(tasks).flat();
    const selectedTaskIndex = allTasks.findIndex((t) => t.id === taskId);
    setSelectedTask(allTasks[selectedTaskIndex]);
    setIsTaskModalOpen(true);
  };

  const renameColumn = (oldName: string, newName: string) => {
    dispatch({ type: "RENAME_COLUMN", payload: { oldName, newName } });
  };

  const addColumn = () => {
    dispatch({ type: "ADD_COLUMN" });
  };

  const removeColumn = (columnName: keyof TaskList) => {
    dispatch({ type: "REMOVE_COLUMN", payload: { columnName } });
  };

  const columnNames = useMemo(() => {
    return Object.keys(state.currentTasks) as (keyof TaskList)[];
  }, [state.currentTasks]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      id="dnd-context-project"
    >
      <div className={`flex h-screen bg-gray-100 w-full`}>
        <AppSidebar activeItem={activeItem} onItemSelect={setActiveItem} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onNewTask={handleNewTask}
            progress={progress}
            tasks={tasks}
            onClickSearch={onClickSearch}
          />

          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <div className="flex-1 overflow-x-auto">
            <div className="p-8">
              <SortableContext
                items={state.columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex flex-row gap-6">
                  {state.columnOrder.map((columnTitle) => (
                    <DraggableKanbanColumn
                      key={columnTitle}
                      id={columnTitle}
                      title={columnTitle}
                      tasks={tasks[columnTitle]}
                      onTaskClick={handleTaskClick}
                      onOpenModal={openTaskModal}
                      onClickEditColumnName={renameColumn}
                      onRemoveColumn={removeColumn}
                    />
                  ))}
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded h-fit mt-3"
                    aria-label="Add column"
                    onClick={addColumn}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </SortableContext>
            </div>
          </div>
        </div>

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onSave={handleSaveTask}
          onAddComment={onAddComment}
          task={selectedTask}
          columnNames={columnNames}
        />

        <DragOverlay>
          {memoizedActiveTask ? (
            <div className="rotate-3 opacity-90">
              <TaskCard task={memoizedActiveTask} onTaskClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

export default Dashboard;

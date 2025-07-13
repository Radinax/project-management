import DraggableTaskCard from "@/components/draggable-task-card";
import { Input } from "@/components/ui/input";
import type { Task, TaskList } from "@/types/tasks";
import { useDroppable } from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Pencil, Plus, Trash, GripVertical } from "lucide-react";
import React, { useState, useRef } from "react";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onOpenModal: () => void;
  onClickEditColumnName: (oldName: string, newName: string) => void;
  onRemoveColumn: (columnName: keyof TaskList) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(
  ({
    id,
    title,
    tasks,
    onTaskClick,
    onOpenModal,
    onClickEditColumnName,
    onRemoveColumn,
  }) => {
    const [editMode, setEditMode] = useState(false);
    const [columnName, setColumnName] = useState(title);
    const { attributes, listeners } = useSortable({ id });

    const inputRef = useRef<HTMLInputElement>(null);

    const { setNodeRef, isOver } = useDroppable({
      id: `column-${title}`,
    });

    const taskIds = tasks.map((task) => task.id);

    const handleSave = () => {
      if (columnName.trim() && columnName !== title) {
        onClickEditColumnName(title, columnName.trim());
      }
      setEditMode(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        setColumnName(title);
        setEditMode(false);
      }
    };

    return (
      <div
        ref={setNodeRef}
        className={`bg-gray-50 rounded-lg p-4 min-h-96 transition-all duration-200 ${
          isOver ? "bg-blue-50 ring-2 ring-blue-300 ring-opacity-50" : ""
        }`}
        style={{ minWidth: "352px" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  setEditMode(true);
                  // Focus input after render
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
                aria-label="Edit column name"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            {editMode ? (
              <div className="w-full max-w-[160px]">
                <Input
                  ref={inputRef}
                  value={columnName}
                  onChange={(e) => setColumnName(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="text-sm font-medium px-2 py-1 h-7 focus:ring-1 focus:ring-blue-400 text-gray-700"
                  placeholder="Column name"
                />
              </div>
            ) : (
              <h2 className="font-semibold text-gray-900 truncate max-w-[160px]">
                {title}
              </h2>
            )}

            {tasks.length > 0 && (
              <span className="bg-gray-200 text-gray-700 text-xs px-2 rounded-sm">
                {tasks.length}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={onOpenModal}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
              aria-label="Add task"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRemoveColumn(title as keyof TaskList)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
              aria-label="Add task"
            >
              <Trash className="w-3 h-3" />
            </button>
            <button
              className="p-1 text-gray-400 hover:text-gray-600"
              {...listeners}
              {...attributes}
            >
              <GripVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <DraggableTaskCard
                key={`draggable-${task.id}-${i}`}
                task={task}
                onTaskClick={onTaskClick}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    );
  }
);
KanbanColumn.displayName = "Kanban column";

export default KanbanColumn;

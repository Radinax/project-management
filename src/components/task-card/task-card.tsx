import type { Task } from "@/types/tasks";
import { Calendar, MessageCircle, Paperclip } from "lucide-react";
import React from "react";

interface TaskCardProps {
  task: Task;
  onTaskClick: (taskId: string) => void;
}
const formatDateForInput = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-");
  return `${month}/${day}/${year}`;
};
const TaskCard: React.FC<TaskCardProps> = React.memo(
  ({ task, onTaskClick }) => {
    const getTagColor = (tag: string) => {
      const colors: Record<string, string> = {
        Feedback: "bg-green-100 text-green-800",
        Bug: "bg-red-100 text-red-800",
        "Landing Page": "bg-indigo-100 text-indigo-800",
        Components: "bg-purple-100 text-purple-800",
        Extension: "bg-orange-100 text-orange-800",
      };
      return colors[tag] || "bg-gray-100 text-gray-800";
    };

    const getPriorityColor = (priority: string) => {
      const colors: Record<string, string> = {
        high: "border-red-500",
        medium: "border-yellow-500",
        low: "border-green-500",
      };
      return colors[priority] || "border-gray-300";
    };

    return (
      <div
        className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(
          task.priority
        )} p-4 cursor-pointer hover:shadow-md transition-all duration-200 mb-4 w-80`}
        onClick={() => onTaskClick(task.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag, i) => (
              <span
                key={`tag-${tag}-${i}`}
                className={`px-2 py-1 text-xs rounded-full ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>

        {task.image && (
          <div className="mb-3">
            <img
              src={task.image}
              alt={task.title}
              className="w-full h-32 object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        )}

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {task.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                {formatDateForInput(task.dueDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                {task.comments.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Paperclip className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">{task.files.length}</span>
            </div>
          </div>

          {task.assignee?.avatar && task.assignee.name && (
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            />
          )}
        </div>
      </div>
    );
  }
);
TaskCard.displayName = "task card";

export default TaskCard;

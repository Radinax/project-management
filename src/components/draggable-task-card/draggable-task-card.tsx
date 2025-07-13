import TaskCard from "@/components/task-card";
import type { Task } from "@/types/tasks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableTaskCardProps {
  task: Task;
  onTaskClick: (taskId: string) => void;
}

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({
  task,
  onTaskClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${
        isDragging ? "opacity-50 z-50" : ""
      } touch-none sm:touch-auto`}
    >
      <TaskCard task={task} onTaskClick={onTaskClick} />
    </div>
  );
};

export default DraggableTaskCard;

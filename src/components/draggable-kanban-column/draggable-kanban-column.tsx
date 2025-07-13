import type { Task, TaskList } from "@/types/tasks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import KanbanColumn from "@/components/kanban-column";

interface DraggableKanbanColumnProps {
  id: string;
  title: keyof TaskList;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onOpenModal: () => void;
  onClickEditColumnName: (oldName: string, newName: string) => void;
  onRemoveColumn: (columnName: keyof TaskList) => void;
}
const DraggableKanbanColumn: React.FC<DraggableKanbanColumnProps> = ({
  id,
  title,
  tasks,
  onTaskClick,
  onOpenModal,
  onClickEditColumnName,
  onRemoveColumn,
}) => {
  const { attributes, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <KanbanColumn
        id={id}
        title={title}
        tasks={tasks}
        onTaskClick={onTaskClick}
        onOpenModal={onOpenModal}
        onClickEditColumnName={onClickEditColumnName}
        onRemoveColumn={onRemoveColumn}
      />
    </div>
  );
};

export default DraggableKanbanColumn;

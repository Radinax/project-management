import DatePicker from "@/components/day-picker/day-picker";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { TAGS } from "@/mock/tags";
import { USERS } from "@/mock/users";
import type { TaskList, Task, TaskFile } from "@/types/tasks";
import type { User } from "@/types/user";
import { format } from "date-fns";
import { X, Send, StickyNote, Paperclip } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { type Comment } from "@/types/comment";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (column: keyof TaskList, taskData: Task) => void;
  onAddComment: (
    column: keyof TaskList,
    taskId: string,
    newComment: Comment
  ) => void;
  task: Task | null;
  columnNames: (keyof TaskList)[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onAddComment,
  task,
  columnNames,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newComment, setNewComment] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [status, setStatus] = useState<Task["status"]>("Incoming");
  const [tags, setTags] = useState<string[]>([TAGS[0]]);
  const [assignee, setAssignee] = useState<User | undefined>(undefined);
  const [dueDate, setDueDate] = useState<string>("2025-07-11");
  const [files, setFiles] = useState<TaskFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      setTags(task.tags || [TAGS[0]]);
      setAssignee(task.assignee);
      setFiles(task.files || []);
      setComments(task.comments || []);
      setDueDate(task.dueDate);
    }
  }, [task]);

  const handleSave = () => {
    if (task) {
      const savedTask: Task = {
        ...task,
        id: task?.id || Date.now().toString(),
        title,
        description,
        priority,
        status,
        tags,
        assignee,
        files,
        dueDate,
        comments,
      };
      onSave(status, savedTask);
      onCloseModal();
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        priority,
        status,
        dueDate,
        comments: [],
        files,
        tags,
        assignee,
      };
      onSave(status, newTask);
      onCloseModal();
    }
  };
  const onComment = () => {
    if (task) {
      const taskComment: Comment = {
        id: crypto.randomUUID(),
        author: {
          name: USERS[0].name,
          avatar: USERS[0].avatar,
        },
        content: newComment,
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, taskComment]);
      onAddComment(status, task.id, taskComment);
    }
    setNewComment("");
  };
  const onClickTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags([...tags].filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };
  const onCloseModal = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("Incoming");
    setTags([TAGS[0]]);
    setFiles([]);
    setAssignee(undefined);
    setDueDate("2025-07-11");
    onClose();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !task) return;

    const reader = new FileReader();

    reader.onload = () => {
      const newFile = {
        name: file.name,
        url: reader.result as string,
        type: file.type,
      };

      const updatedTask: Task = {
        ...task,
        files: [...(task.files || []), newFile],
      };

      setFiles([...updatedTask.files]);

      // Reset file input so same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    if (file.type.startsWith("image/")) {
      reader.readAsDataURL(file); // Load preview for images
    } else {
      // Just store name for non-images
      reader.readAsText(file); // Or skip reading content, just store name
    }
  };

  const handleDateChange = (date: Date) => {
    const isoDate = format(date, "yyyy-MM-dd");
    setDueDate(isoDate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-gray-700">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] sm:max-h-[90vh] overflow-y-auto mx-10">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-xl font-semibold">
            {task ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={onCloseModal}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-full flex-col sm:flex-row ">
          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="mb-2 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter task title..."
              />
            </div>

            <div className="mb-2 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter task description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2 sm:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as "high" | "medium" | "low")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <DatePicker
                  selectedDate={dueDate}
                  onDateChange={handleDateChange}
                />
              </div>
            </div>

            <div className="mb-2 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {columnNames.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            {task && (
              <div className="mb-2 sm:mb-6">
                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                <div className="space-y-4 max-h-32 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">
                            {comment.author.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {comment.createdAt}{" "}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={onComment}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full sm:w-80 bg-gray-50 p-4 sm:p-6 border-l-0 sm:border-l">
            <div className="space-y-2 sm:space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Assignee</h4>
                {/* Dropdown/List of Users */}
                <div className="mt-2">
                  <Select
                    value={assignee?.name}
                    onValueChange={(value: string) => {
                      const selectedUser = USERS.find(
                        (user) => user.name === value
                      );
                      if (selectedUser) {
                        setAssignee(selectedUser);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {USERS.map((user) => (
                        <SelectItem
                          key={`select-${user.name}`}
                          value={user.name}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span>{user.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => {
                    const isSelected = tags.includes(tag);
                    return (
                      <span
                        key={tag}
                        className={`${
                          isSelected
                            ? "bg-indigo-800 text-indigo-100"
                            : "bg-indigo-100 text-indigo-800"
                        } px-2 py-1 bg-indigo-100 text-xs rounded-full cursor-pointer`}
                        onClick={() => onClickTag(tag)}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Attachments</h4>
                {/* Hidden input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="*" // or limit to images only: "image/*"
                />
                {files.map((file) => (
                  <div
                    key={`${file.name}`}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    <StickyNote className="w-4 h-4" />
                    <span>{file.name}</span>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 mt-2"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="underline">Add attachment</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {task ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

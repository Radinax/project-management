import ComingSoonTooltip from "@/components/tooltip";
import { CommandItem, CommandList } from "@/components/ui/command";
import { USERS } from "@/mock/users";
import type { TaskList } from "@/types/tasks";
import {
  List,
  Calendar,
  Command,
  Search,
  Bell,
  Settings,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { Command as CommandPrimitive } from "cmdk";

interface HeaderProps {
  onNewTask: () => void;
  progress?: number;
  tasks: TaskList;
  onClickSearch: (taskId: string) => void;
}

const teamMembers = [USERS[0], USERS[1], USERS[2]];

const Header: React.FC<HeaderProps> = ({
  onNewTask,
  progress = 0,
  tasks,
  onClickSearch,
}) => {
  const [open, setOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleValueChange = (value: string) => {
    setInputValue(value);
    setOpen(!!value);
  };

  const allTasks = useMemo(() => {
    return Object.values(tasks).flat();
  }, [tasks]);

  const filteredCommands = Array.isArray(allTasks)
    ? allTasks.filter((command) =>
        command.title.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-8 py-2">
        <div className="flex items-center space-x-8">
          <div className="ml-6 flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-indigo-600 font-medium">
              <span className="hidden sm:block font-semibold">Task Board</span>
            </button>
            <ComingSoonTooltip>
              <button
                disabled
                className="flex items-center space-x-2 text-gray-600"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:block">List</span>
              </button>
            </ComingSoonTooltip>
            <ComingSoonTooltip>
              <button
                disabled
                className="flex items-center space-x-2 text-gray-600"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:block">Calendar</span>
              </button>
            </ComingSoonTooltip>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Responsive Command Search */}
          <div className="relative">
            {/* Desktop: Full Command Input */}
            <div className="hidden sm:block">
              <Command className="rounded-lg border border-b-0 border-zinc-200 shadow-md bg-white text-gray-600">
                <div className="flex items-center px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandPrimitive.Input
                    placeholder="Search"
                    onValueChange={handleValueChange}
                    className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <CommandList
                  className={`${
                    inputValue.length > 0
                      ? "absolute top-10 bg-white py-4 w-full z-10"
                      : ""
                  }`}
                >
                  {open &&
                    filteredCommands.length > 0 &&
                    filteredCommands.map((command) => (
                      <CommandItem
                        key={command.id}
                        value={command.title}
                        onSelect={() => {
                          onClickSearch(command.id);
                          setOpen(false);
                          setInputValue("");
                        }}
                        className="!bg-white !text-gray-600 cursor-pointer hover:!bg-gray-100 !px-4"
                      >
                        {command.title}
                      </CommandItem>
                    ))}
                </CommandList>
              </Command>
            </div>

            {/* Mobile: Icon Button that Expands Inline */}
            <div className="block sm:hidden">
              <div className="relative">
                {/* Search Trigger Button */}
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={() => setIsExpanded(true)}
                >
                  <Search className="h-5 w-5" />
                </button>

                {/* Expanded Mobile Search Overlay */}
                {isExpanded && (
                  <div className="fixed inset-0 bg-white z-50 flex flex-col">
                    {/* Top Bar with Close Button */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center w-full">
                        <Search className="mr-2 h-4 w-4 text-gray-400" />
                        <input
                          autoFocus
                          placeholder="Search tasks..."
                          value={inputValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            setInputValue(val);
                            setOpen(!!val);
                          }}
                          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-gray-700"
                        />
                      </div>
                      <button
                        onClick={() => setIsExpanded(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Results List */}
                    <div className="flex-1 overflow-auto px-2 py-4">
                      <ul className="space-y-2">
                        {open &&
                          filteredCommands.length > 0 &&
                          filteredCommands.map((command) => (
                            <li key={command.id}>
                              <button
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700"
                                onClick={() => {
                                  onClickSearch(command.id);
                                  setIsExpanded(false);
                                  setInputValue("");
                                }}
                              >
                                {command.title}
                              </button>
                            </li>
                          ))}

                        {open && filteredCommands.length === 0 && (
                          <p className="text-center text-gray-400 mt-8">
                            No results found
                          </p>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ComingSoonTooltip>
            <button disabled className="block p-2 text-gray-600 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
          </ComingSoonTooltip>
          <ComingSoonTooltip>
            <button disabled className="block p-2 text-gray-600 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </ComingSoonTooltip>
        </div>
      </div>

      {/* Project Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 px-8 py-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Project Persona
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {teamMembers.map((member, i) => (
                    <img
                      key={`header-members-${i}`}
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-white text-sm opacity-90">
                  +{USERS.length - teamMembers.length} people
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <ComingSoonTooltip>
              <button
                disabled
                className="block p-2 bg-white text-gray-500 rounded-lg cursor-normal"
              >
                <Settings className="w-5 h-5" />
              </button>
            </ComingSoonTooltip>

            <ComingSoonTooltip>
              <button
                disabled
                className="block p-2 bg-white text-gray-500 rounded-lg cursor-normal"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </ComingSoonTooltip>
            <button
              onClick={onNewTask}
              className="bg-indigo-500 hover:bg-opacity-80 text-white px-2 sm:px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:block">New Task</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm opacity-90">
              Project Progress
            </span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

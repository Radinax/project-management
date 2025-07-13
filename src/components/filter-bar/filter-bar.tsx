import ComingSoonTooltip from "@/components/tooltip";
import { Calendar, ChevronDown, Grid3X3, List, Search } from "lucide-react";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  viewMode: "kanban" | "list" | "calendar";
  onViewModeChange?: (mode: "kanban" | "list" | "calendar") => void;
}

const FilterBar = ({
  searchTerm,
  onSearchChange,
  onFilterChange,
  viewMode,
}: FilterBarProps) => {
  const filters = [
    { id: "subtasks", label: "Subtasks" },
    { id: "me", label: "Me" },
    { id: "assignees", label: "Assignees" },
  ];
  const rightSection = (
    <div className="w-full flex justify-end">
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <ComingSoonTooltip>
          <button disabled className="p-2 rounded-md text-gray-600">
            <List className="w-4 h-4" />
          </button>
        </ComingSoonTooltip>

        <button
          disabled
          className={`p-2 rounded-md ${
            viewMode === "kanban"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>

        <ComingSoonTooltip>
          <button disabled className="p-2 rounded-md text-gray-600">
            <Calendar className="w-4 h-4" />
          </button>
        </ComingSoonTooltip>
      </div>
    </div>
  );

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-2">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center justify-evenly w-full">
        {/* Left Section: Search */}
        <div className="w-full flex flex-row sm:flex-col gap-2 sm:w-fit">
          <div className="relative pr-0 sm:pr-20">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={onSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full text-gray-700"
            />
          </div>
          <div className="block sm:hidden">{rightSection}</div>
        </div>

        {/* Center Section: Filters */}
        <div className="w-full">
          <div className="flex flex-wrap gap-4 justify-center">
            {filters.map((filter) => (
              <ComingSoonTooltip key={filter.id}>
                <button
                  disabled
                  onClick={() => onFilterChange(filter.id)}
                  className="px-0 sm:px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 cursor-default"
                >
                  {filter.label}
                  {filter.id !== "all" && (
                    <ChevronDown className="w-4 h-4 inline ml-1" />
                  )}
                </button>
              </ComingSoonTooltip>
            ))}
          </div>
        </div>

        {/* Right Section: View Mode Buttons */}
        <div className="hidden sm:block">{rightSection}</div>
      </div>
    </div>
  );
};

export default FilterBar;

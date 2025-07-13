import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  selectedDate: string | null;
  onDateChange: (date: Date) => void;
}
function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  // Parse the initial date string into a Date object
  const parsedDate = useMemo(() => {
    if (!selectedDate) return undefined;
    const date = parse(selectedDate, "yyyy-MM-dd", new Date());
    return isNaN(date.getTime()) ? undefined : date;
  }, [selectedDate]);

  // Format the date for display (MM/dd/yyyy)
  const displayDate = parsedDate ? format(parsedDate, "MM/dd/yyyy") : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !displayDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{displayDate || "Pick a date"}</span>
        </Button>
      </PopoverTrigger>
      {parsedDate && (
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={parsedDate}
            defaultMonth={parsedDate}
            onSelect={(date) => {
              if (date) onDateChange(date);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      )}
    </Popover>
  );
}

export default DatePicker;

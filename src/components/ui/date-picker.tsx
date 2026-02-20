"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

export function DatePicker() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  return (
    <InputGroup
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors duration-150 ease-in-out hover:border-brand-primary/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 focus-visible:outline-none focus:ring-offset-0"
    >
      <InputGroupInput
        id="date-merged"
        value={value}
        placeholder="Select date"
        onChange={(e) => {
          const newDate = new Date(e.target.value);
          setValue(e.target.value);
          if (isValidDate(newDate)) {
            setDate(newDate);
            setMonth(newDate);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />

      {/* Calendar Icon Button */}
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>
            <div>
              <InputGroupButton
                id="date-picker-merged"
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </div>
          </PopoverTrigger>

          {/* Calendar Dropdown */}
          <PopoverContent
            className="min-w-[160px] rounded-xl border bg-white p-0 shadow-md z-[9999]"
            align="end"
            alignOffset={-8}
            sideOffset={10}
            onMouseDown={(e) => e.stopPropagation()}
  onClick={(e) => e.stopPropagation()} 
          >
            <Calendar
              mode="single"
              selected={date}
              month={month}
              className="rounded-lg border w-full bg-white p-2 [--cell-size:2.25rem] [--cell-radius:0.375rem]"
              captionLayout="dropdown" // ✅ enables month/year dropdown
              onMonthChange={setMonth}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                setValue(formatDate(selectedDate));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}

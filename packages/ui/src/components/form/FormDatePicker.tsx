"use client";

import { cn } from "@workspace/ui/lib/utils";
import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type * as React from "react";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { FormBase, type FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

export type FormDatePickerProps = FormControlProps & {
  className?: string;
} & Omit<React.ComponentProps<typeof Calendar>, "selected" | "onSelect" | "mode">;

export function FormDatePicker({ className, ...props }: FormDatePickerProps) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  let date: Date | undefined;
  if (field.state.value instanceof Date) {
    date = field.state.value;
  } else if (typeof field.state.value === "string" && field.state.value !== "") {
    const parsed = parseISO(field.state.value);
    if (isValid(parsed)) {
      date = parsed;
    }
  }

  const handleSelect = (selectedDate: Date | undefined) => {
    const val = field.state.value;
    if (selectedDate) {
      if (typeof val === "string" || val === "") {
        field.handleChange(format(selectedDate, "yyyy-MM-dd"));
      } else {
        field.handleChange(selectedDate);
      }
    } else {
      if (typeof val === "string" || val === "") {
        field.handleChange("");
      } else {
        field.handleChange(undefined);
      }
    }
  };

  return (
    <FormBase {...props}>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id={field.name}
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                isInvalid && "border-destructive text-destructive",
                className,
              )}
              onBlur={field.handleBlur}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>{props.placeholder || "Pick a date"}</span>}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleSelect} {...props} />
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}

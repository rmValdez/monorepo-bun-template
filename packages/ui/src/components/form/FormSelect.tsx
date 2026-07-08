"use client";

import type { ReactNode } from "react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../select";
import { FormBase, type FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

type FormSelectProps<TValue = string> = FormControlProps & {
  children: ReactNode;
  placeholder?: ReactNode;
  renderValue?: (value: TValue) => ReactNode;
  items?: TValue[];
  itemToValue?: (item: TValue) => string;
  onValueChange?: (value: string) => void;
};

export function FormSelect<TValue = string>({
  children,
  placeholder,
  renderValue,
  items,
  itemToValue,
  onValueChange,
  ...props
}: FormSelectProps<TValue>) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const hasValue = field.state.value !== undefined && field.state.value !== null && field.state.value !== "";

  const selectedItem = items && itemToValue ? items.find((item) => itemToValue(item) === field.state.value) : undefined;

  const valueChildren = !hasValue
    ? () => placeholder
    : renderValue
      ? () => {
          if (itemToValue !== undefined) {
            return selectedItem !== undefined ? renderValue(selectedItem) : placeholder;
          }
          return renderValue(field.state.value as unknown as TValue);
        }
      : undefined;

  return (
    <FormBase {...props}>
      <Select
        onValueChange={(value) => (onValueChange ? onValueChange(value ?? "") : field.handleChange(value ?? ""))}
        value={field.state.value !== undefined && field.state.value !== null ? String(field.state.value) : null}
      >
        <SelectTrigger aria-invalid={isInvalid} id={field.name} onBlur={field.handleBlur}>
          <SelectValue>{valueChildren}</SelectValue>
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </FormBase>
  );
}

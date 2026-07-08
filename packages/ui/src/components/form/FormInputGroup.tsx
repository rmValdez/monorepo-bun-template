"use client";

import type { ReactNode } from "react";
import { InputGroup, InputGroupInput } from "../input-group";
import { FormBase, type FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

interface FormInputGroupProps extends FormControlProps {
  type?: string;
  children?: ReactNode;
}

export function FormInputGroup({ type = "text", children, ...props }: FormInputGroupProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <InputGroup>
        <InputGroupInput
          id={field.name}
          name={field.name}
          type={type}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
        />
        {children}
      </InputGroup>
    </FormBase>
  );
}

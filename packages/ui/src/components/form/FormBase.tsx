"use client";

import type { ReactNode } from "react";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "../field";
import { useFieldContext } from "./hooks";

export type FormControlProps = {
  label: string;
  description?: string;
  placeholder?: string;
  autoComplete?: string;
};

type FormBaseProps = FormControlProps & {
  children: ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
};

export function FormBase({ children, label, description, controlFirst, horizontal }: FormBaseProps) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const labelElement = (
    <>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
    </>
  );

  const flatErrors = field.state.meta.errors?.flatMap(normalizeError);

  const errorElem = isInvalid && <FieldError errors={flatErrors} />;

  return (
    <Field data-invalid={isInvalid} orientation={horizontal ? "horizontal" : undefined}>
      {controlFirst ? (
        <>
          {children}
          <FieldContent>
            {labelElement}
            {errorElem}
          </FieldContent>
        </>
      ) : (
        <>
          <FieldContent>{labelElement}</FieldContent>
          {children}
          {errorElem}
        </>
      )}
    </Field>
  );
}

type TFieldError = { message: string };

function normalizeError(err: unknown): TFieldError | TFieldError[] {
  if (typeof err === "string") {
    return { message: err };
  }

  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message: unknown }).message;

    if (Array.isArray(msg)) {
      return msg.filter((m): m is string => typeof m === "string").map((m) => ({ message: m }));
    }

    if (typeof msg === "string") {
      return { message: msg };
    }
  }

  return { message: "Invalid value" };
}

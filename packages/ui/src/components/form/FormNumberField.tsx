"use client";

import { NumberField } from "../number-field";
import { FormBase, type FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

export interface FormNumberFieldProps extends FormControlProps {
  showSteppers?: boolean;
  step?: number;
  format?: Intl.NumberFormatOptions;
}

export function FormNumberField({ showSteppers, step, format, ...props }: FormNumberFieldProps) {
  const field = useFieldContext<number | undefined | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <NumberField
        id={field.name}
        name={field.name}
        value={field.state.value ?? undefined}
        onValueChange={(value) => field.handleChange(value)}
        onBlur={field.handleBlur}
        showSteppers={showSteppers}
        aria-invalid={isInvalid}
        placeholder={props.placeholder}
        step={step}
        format={format}
        inputProps={{
          "aria-invalid": isInvalid,
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
            const target = e.currentTarget;
            const maxDecimals = format?.maximumFractionDigits;
            if (maxDecimals !== undefined && e.key.length === 1 && /\d/.test(e.key)) {
              const dotIndex = target.value.indexOf(".");
              if (
                dotIndex !== -1 &&
                target.value.length - dotIndex > maxDecimals &&
                target.selectionStart !== null &&
                target.selectionStart > dotIndex &&
                target.selectionStart === target.selectionEnd
              ) {
                e.preventDefault();
              }
            }
          },
        }}
      />
    </FormBase>
  );
}

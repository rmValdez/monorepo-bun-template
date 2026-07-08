import type { AnyFieldApi, AnyFieldMeta } from "@tanstack/react-form-start";

export const getFieldInvalid = (field: AnyFieldApi, isSubmitted: boolean) => {
  const hasErrors = field.state.meta.errors.length > 0;
  const shouldShowError = field.state.meta.isTouched || isSubmitted;

  return hasErrors && shouldShowError;
};

export type BaseFieldMeta = Omit<AnyFieldMeta, "errors" | "isPristine" | "isValid" | "isDefaultValue">;

export type Updater<T> = T | ((old: T) => T);

export interface FormWithSetFieldMeta<TFormData> {
  setFieldMeta: (field: keyof TFormData, updater: Updater<BaseFieldMeta>) => void;
}

export const handleFormActionErrors = <TFormData>(
  form: FormWithSetFieldMeta<TFormData>,
  response: { fieldErrors?: Partial<Record<keyof TFormData, string | string[]>>; formError?: string },
  options?: {
    onFormError?: (error: string) => void;
  },
) => {
  if (response.fieldErrors) {
    for (const [field, message] of Object.entries(response.fieldErrors)) {
      if (message) {
        form.setFieldMeta(field as keyof TFormData, (prev: BaseFieldMeta) => ({
          ...prev,
          errorMap: {
            ...prev.errorMap,
            onSubmit: message,
          },
        }));
      }
    }
  }

  if (response.formError) {
    if (options?.onFormError) {
      options.onFormError(response.formError);
    } else {
      console.error(response.formError);
    }
  }
};

export const handleServerFnError = <TFormData>(form: FormWithSetFieldMeta<TFormData>, error: Error) => {
  try {
    // TanStack server functions throw Zod issues as a JSON string in error.message
    const issues = JSON.parse(error.message);

    if (Array.isArray(issues)) {
      const fieldErrors: Partial<Record<keyof TFormData, string[]>> = {};

      issues.forEach((issue) => {
        const field = issue.path?.[0];
        if (typeof field === "string") {
          const key = field as keyof TFormData;
          const existing = fieldErrors[key] ?? [];
          existing.push(issue.message);
          fieldErrors[key] = existing;
        }
      });

      handleFormActionErrors(form, { fieldErrors });
      return true;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

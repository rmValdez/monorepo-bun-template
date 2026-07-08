import { createFormHook, createFormHookContexts } from "@tanstack/react-form-start";
import { FormCheckbox } from "./FormCheckbox";
import { FormDatePicker } from "./FormDatePicker";
import { FormInput } from "./FormInput";
import { FormInputGroup } from "./FormInputGroup";
import { FormNumberField } from "./FormNumberField";
import { FormSelect } from "./FormSelect";
import { FormTextarea } from "./FormTextarea";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    DatePicker: FormDatePicker,
    Textarea: FormTextarea,
    Select: FormSelect,
    Checkbox: FormCheckbox,
    InputGroup: FormInputGroup,
    NumberField: FormNumberField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };

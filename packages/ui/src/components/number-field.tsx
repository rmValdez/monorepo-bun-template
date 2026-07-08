// docs: https://base-ui.com/react/components/number-field#input
// Reference: https://github.com/shadcn-ui/ui/issues/4385
// Goal: https://shadcn-number-input.vercel.app

import { NumberField as PrimitiveNumberField } from "@base-ui/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";

function NumberField({
  showSteppers,
  placeholder,
  inputProps,
  ...props
}: PrimitiveNumberField.Root.Props & {
  showSteppers?: boolean;
  placeholder?: string;
  inputProps?: React.ComponentProps<typeof PrimitiveNumberField.Input>;
}) {
  return (
    <PrimitiveNumberField.Root {...props}>
      <PrimitiveNumberField.Group render={<InputGroup />}>
        {showSteppers && (
          <InputGroupAddon>
            <PrimitiveNumberField.Decrement render={<InputGroupButton size="icon-xs" />}>
              <MinusIcon />
            </PrimitiveNumberField.Decrement>
          </InputGroupAddon>
        )}
        <PrimitiveNumberField.Input render={<InputGroupInput placeholder={placeholder} />} {...inputProps} />
        {showSteppers && (
          <InputGroupAddon align="inline-end">
            <PrimitiveNumberField.Increment render={<InputGroupButton size="icon-xs" />}>
              <PlusIcon />
            </PrimitiveNumberField.Increment>
          </InputGroupAddon>
        )}
      </PrimitiveNumberField.Group>
    </PrimitiveNumberField.Root>
  );
}

export { NumberField };

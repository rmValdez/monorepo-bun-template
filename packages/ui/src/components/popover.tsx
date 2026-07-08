import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@workspace/ui/lib/utils";
import * as React from "react";

const PopoverContext = React.createContext<React.RefObject<Element | null> | null>(null);

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  const anchorRef = React.useRef<Element | null>(null);
  return (
    <PopoverContext.Provider value={anchorRef}>
      <PopoverPrimitive.Root data-slot="popover" {...props} />
    </PopoverContext.Provider>
  );
}

interface PopoverAnchorProps {
  render?: React.ReactNode;
  children?: React.ReactNode;
}

function PopoverAnchor({ render, children }: PopoverAnchorProps) {
  const anchorRef = React.useContext(PopoverContext);
  const element = render || children;

  if (!React.isValidElement(element)) {
    return element as React.ReactNode;
  }

  return React.cloneElement(element as React.ReactElement<{ ref?: React.Ref<Element> }>, {
    ref: (node: Element | null) => {
      if (anchorRef) anchorRef.current = node;

      const existingRef =
        ((element as React.ReactElement).props as { ref?: React.Ref<Element> }).ref ??
        (element as React.ReactElement as unknown as { ref?: React.Ref<Element> }).ref;

      if (typeof existingRef === "function") {
        existingRef(node);
      } else if (existingRef) {
        (existingRef as React.RefObject<Element | null>).current = node;
      }
    },
  });
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  const anchorRef = React.useContext(PopoverContext);

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        anchor={anchorRef || undefined}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-none bg-popover p-2.5 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="popover-header" className={cn("flex flex-col gap-1 text-xs", className)} {...props} />;
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title data-slot="popover-title" className={cn("text-sm font-medium", className)} {...props} />
  );
}

function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-xs/relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger };

"use client";

import {
  DirectionProvider as BaseDirectionProvider,
  useDirection as useBaseDirection,
} from "@base-ui/react/direction-provider";
import type * as React from "react";

function DirectionProvider({
  dir,
  direction,
  children,
}: React.ComponentProps<typeof BaseDirectionProvider> & {
  dir?: React.ComponentProps<typeof BaseDirectionProvider>["direction"];
}) {
  return <BaseDirectionProvider direction={direction ?? dir}>{children}</BaseDirectionProvider>;
}

function useDirection(localDir?: "ltr" | "rtl"): "ltr" | "rtl" {
  const contextDir = useBaseDirection();
  return localDir ?? contextDir ?? "ltr";
}

export { DirectionProvider, useDirection };

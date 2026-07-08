import { createCsrfMiddleware, createStart } from "@tanstack/react-start";
import { globalLoggerMiddleware } from "@/server/middleware/global.middleware";

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, globalLoggerMiddleware],
}));

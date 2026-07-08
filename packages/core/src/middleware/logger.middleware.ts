import { createMiddleware } from "@tanstack/react-start";

export const requestLoggerMiddleware = createMiddleware().server(async ({ next, pathname }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;

  const m = Math.floor(duration / 60000);
  const s = Math.floor((duration % 60000) / 1000);
  const ms = duration % 1000;
  const durationStr = m > 0 ? `${m}m ${s}s` : s > 0 ? `${s}s` : `${ms}ms`;

  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const time = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  process.stdout.write(`[server]   ${time}  ~ ${pathname} ~ ${durationStr}\n`);
  return result;
});

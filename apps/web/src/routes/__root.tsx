import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import appCss from "@workspace/ui/globals.css?url";
import type { AuthSession } from "@/server/auth/auth.functions";
import { authQueries } from "@/server/auth/auth.queries";

interface RootRouterContext {
  queryClient: QueryClient;
  authSession: AuthSession;
}

export const Route = createRootRouteWithContext<RootRouterContext>()({
  beforeLoad: async ({ context }) => {
    const authSession = await context.queryClient.fetchQuery(authQueries.getAuthSession());
    return { authSession };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bun Monorepo Template" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/general-sans" rel="stylesheet" />
        <HeadContent />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <TooltipProvider>{children}</TooltipProvider>
        <Scripts />
      </body>
    </html>
  );
}

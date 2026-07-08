import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { AlertTriangle, type LucideIcon, ShieldOff } from "lucide-react";

export const REDIRECT_REASON = {
  AUTH_REQUIRED: "auth_required",
  PERMISSION_DENIED: "permission_denied",
  NO_ORGANIZATION: "no_organization",
  NOT_ACTIVE: "not_active",
  NOT_FOUND: "not_found",
  SOMETHING_WENT_WRONG: "something_went_wrong",
  BAD_REQUEST: "bad_request",
} as const;

type RedirectReason = (typeof REDIRECT_REASON)[keyof typeof REDIRECT_REASON];

const reasonConfig: Record<RedirectReason, { title: string; description: string; icon: LucideIcon }> = {
  [REDIRECT_REASON.AUTH_REQUIRED]: {
    title: "Authentication Required",
    description: "You need to be signed in to access this page.",
    icon: ShieldOff,
  },
  [REDIRECT_REASON.PERMISSION_DENIED]: {
    title: "Permission Denied",
    description: "You do not have the necessary permissions to access this page.",
    icon: ShieldOff,
  },
  [REDIRECT_REASON.NO_ORGANIZATION]: {
    title: "No Organization Access",
    description: "Your account is not associated with an active organization. Contact your administrator.",
    icon: AlertTriangle,
  },
  [REDIRECT_REASON.NOT_ACTIVE]: {
    title: "Account Not Active",
    description: "Your account is not active. Please contact your system administrator.",
    icon: AlertTriangle,
  },
  [REDIRECT_REASON.NOT_FOUND]: {
    title: "Not Found",
    description: "The page you are looking for does not exist.",
    icon: AlertTriangle,
  },
  [REDIRECT_REASON.SOMETHING_WENT_WRONG]: {
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again or contact support.",
    icon: AlertTriangle,
  },
  [REDIRECT_REASON.BAD_REQUEST]: {
    title: "Bad Request",
    description: "An unexpected error occurred. Please try again or contact support.",
    icon: AlertTriangle,
  },
};

const fallback = {
  title: "Something went wrong",
  description: "An unexpected error occurred. Please try again or contact support.",
  icon: AlertTriangle,
};

export const Route = createFileRoute("/(error)/error")({
  validateSearch: (search: Record<string, unknown>) => ({
    reason: search.reason as RedirectReason | undefined,
  }),
  component: ErrorPage,
});

function ErrorPage() {
  const { reason } = Route.useSearch();
  const config = (reason && reasonConfig[reason]) ?? fallback;
  const Icon = config.icon;

  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-4">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{config.title}</h1>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>

        <div className="flex gap-2 justify-center">
          <Button onClick={() => router.history.back()}>Go Back</Button>

          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

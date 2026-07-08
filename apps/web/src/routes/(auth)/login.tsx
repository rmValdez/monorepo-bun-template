import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { handleFormActionErrors, handleServerFnError } from "@workspace/core/utils/form-utils";
import { Button } from "@workspace/ui/components/button";
import { FieldGroup } from "@workspace/ui/components/field";
import { useAppForm } from "@workspace/ui/components/form/hooks";
import { InputGroupAddon, InputGroupButton } from "@workspace/ui/components/input-group";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { sanitizeRedirect } from "@/hooks/usePreviousLocation";
import { signInFn } from "@/server/auth/auth.functions";
import { loginSchema, type TLoginSchemaInput } from "@/server/auth/auth.schema";

export const Route = createFileRoute("/(auth)/login")({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
    reason: z.string().optional(),
  }),
  beforeLoad: async ({ context, search }) => {
    if (context.authSession) {
      const safe = sanitizeRedirect(search.redirectTo);
      const target = safe === "/" ? "/" : safe;

      throw redirect({ to: target });
    }

    return { safeRedirectTo: search.redirectTo };
  },
  component: LoginPage,
});

function LoginPage() {
  const { safeRedirectTo } = Route.useRouteContext();

  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <div className="min-h-screen flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="max-w-lg space-y-8 w-full flex flex-col px-7 py-10 border overflow-hidden shadow-xl">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign in to your account</h1>
            <p className="text-muted-foreground text-sm">Enter your credentials to access the portal</p>
          </div>

          <LoginForm redirectTo={safeRedirectTo} />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?
              <Link to="/register" className="font-semibold text-primary-navy hover:underline underline-offset-4">
                {" Register here"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-slate-50 border-t border-border p-8 md:p-12">
        <div className="max-w-[450px] mx-auto">
          <div className="flex flex-col items-center gap-4 text-sm">
            <p className="text-slate-600 font-medium">Encountered an issue logging in?</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link to="/" className="font-semibold text-primary-navy hover:underline underline-offset-4">
                Find User ID
              </Link>
              <Link to="/" className="font-semibold text-primary-navy hover:underline underline-offset-4">
                Unlock Account
              </Link>
              <Link to="/" className="font-semibold text-primary-navy hover:underline underline-offset-4">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const LoginForm = ({ redirectTo }: { redirectTo?: string }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState(false);

  const signInMutation = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: signInFn,
    onSuccess: (response) => {
      if (!response.success) {
        handleFormActionErrors(loginForm, response);
        return;
      }

      queryClient.resetQueries();
      const target = sanitizeRedirect(redirectTo, response.data.to);

      return navigate({ to: target });
    },
    onError: (error) => {
      handleServerFnError(loginForm, error);
    },
  });

  const loginForm = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies TLoginSchemaInput,
    validators: {
      onChange: loginSchema,
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      signInMutation.mutate({ data: value });
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        loginForm.handleSubmit();
      }}
    >
      <FieldGroup>
        <loginForm.AppField name="email">
          {(field) => <field.Input label="Email" placeholder="you@example.com" />}
        </loginForm.AppField>

        <loginForm.AppField name="password">
          {(field) => (
            <field.InputGroup
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
            >
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroupAddon>
            </field.InputGroup>
          )}
        </loginForm.AppField>
      </FieldGroup>

      <div>
        <Link to="/forgot-password">
          <Button variant="link" className="text-primary-navy bt-1 px-0">
            Forgot password?
          </Button>
        </Link>
        <loginForm.Subscribe selector={(state) => [state.isValidating, state.isSubmitting]}>
          {([isValidating, isSubmitting]) => (
            <Button type="submit" disabled={isValidating || isSubmitting} className="w-full h-12 font-bold text-lg">
              {isSubmitting ? "Logging in..." : "Log In"}
              <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </loginForm.Subscribe>
      </div>
    </form>
  );
};

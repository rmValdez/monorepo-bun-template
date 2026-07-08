import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { FieldGroup, FieldSet } from "@workspace/ui/components/field";
import { useAppForm } from "@workspace/ui/components/form/hooks";
import { handleFormActionErrors, handleServerFnError } from "@workspace/core/utils/form-utils";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signupFn } from "@/server/auth/auth.functions";
import { registerSchema, type TRegisterSchemaInput } from "@/server/auth/auth.schema";

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const registerForm = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    } as TRegisterSchemaInput,
    validators: {
      onChange: registerSchema,
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      registerMutation.mutate({ data: value });
    },
  });

  const registerMutation = useMutation({
    mutationFn: signupFn,
    onSuccess: (response) => {
      if (!response?.success) {
        handleFormActionErrors(registerForm, response);
        return;
      }
      navigate({ to: "/login" });
    },
    onError: (error) => {
      handleServerFnError(registerForm, error);
    },
  });

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            registerForm.handleSubmit();
          }}
          className="space-y-5"
        >
          <FieldSet>
            <FieldGroup className="space-y-4">
              <registerForm.AppField name="name">
                {(field) => <field.Input label="Full Name" placeholder="Jane Doe" />}
              </registerForm.AppField>

              <registerForm.AppField name="email">
                {(field) => <field.Input label="Email" placeholder="you@example.com" />}
              </registerForm.AppField>

              <registerForm.AppField name="password">
                {(field) => (
                  <field.InputGroup label="Password" type="password" placeholder="At least 6 characters" />
                )}
              </registerForm.AppField>
            </FieldGroup>
          </FieldSet>

          <registerForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" className="w-full" disabled={!canSubmit}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            )}
          </registerForm.Subscribe>
        </form>
      </div>
    </main>
  );
}

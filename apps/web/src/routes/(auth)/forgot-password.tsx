import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { FieldGroup } from "@workspace/ui/components/field";
import { useAppForm } from "@workspace/ui/components/form/hooks";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { forgotPasswordSchema, type TForgotPasswordSchemaInput } from "@/server/auth/auth.schema";

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      console.log(email);

      // Wait to simulate network
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: (_, variables) => {
      setIsSubmitted(true);
      setSubmittedEmail(variables);
    },
    onError: (error, variables) => {
      console.error("Forgot password error:", error);
      setIsSubmitted(true);
      setSubmittedEmail(variables);
    },
  });

  const forgotPasswordForm = useAppForm({
    defaultValues: {
      email: "",
    } satisfies TForgotPasswordSchemaInput,
    onSubmit: async ({ value }) => {
      forgotPasswordMutation.mutate(value.email);
    },
    validators: { onChange: forgotPasswordSchema, onSubmit: forgotPasswordSchema },
  });

  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <div className="min-h-screen flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="max-w-lg space-y-8 w-full flex flex-col px-7 py-10 border overflow-hidden shadow-xl">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Forgot Password</h1>
            <p className="text-muted-foreground text-sm">
              {isSubmitted
                ? "We've sent reset instructions to your email."
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>
          {isSubmitted ? (
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 text-sm leading-relaxed text-center">
              You will receive reset instructions shortly at
              <strong className="text-slate-900">{` ${submittedEmail}`}</strong>. Please check your inbox and follow the
              steps provided to regain access to your account.
            </div>
          ) : (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                forgotPasswordForm.handleSubmit();
              }}
            >
              <FieldGroup>
                <forgotPasswordForm.AppField name="email">
                  {(field) => <field.Input label="Email" placeholder="you@example.com" />}
                </forgotPasswordForm.AppField>
              </FieldGroup>

              <div>
                <forgotPasswordForm.Subscribe selector={(state) => [state.isValidating, state.isSubmitting]}>
                  {([isValidating, isSubmitting]) => {
                    const disabled = isValidating || isSubmitting || forgotPasswordMutation.isPending;
                    return (
                      <Button type="submit" disabled={disabled} className="w-full h-12 font-bold text-lg group">
                        {disabled ? "Sending..." : "Send Reset Link"}
                        {!disabled && (
                          <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                        )}
                      </Button>
                    );
                  }}
                </forgotPasswordForm.Subscribe>
              </div>
            </form>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Remembered your password?
              <Link to="/login" className="font-semibold text-primary-navy hover:underline underline-offset-4">
                {" Back to login"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-slate-50 border-t border-border p-8 md:p-12">
        <div className="max-w-[450px] mx-auto">
          <div className="flex flex-col items-center gap-4 text-sm">
            <p className="text-slate-600 font-medium">Need assistance or technical support?</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link to="/" className="font-semibold text-primary-navy hover:underline underline-offset-4">
                Help Center
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

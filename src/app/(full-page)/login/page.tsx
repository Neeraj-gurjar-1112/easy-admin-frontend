"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import authService from "@/api-services/AuthService";
import { ApiError } from "@/types/api";
import { AGENT_RULES } from "@/utils/constants";

interface LoginValues {
  email: string;
  password: string;
}

const DEFAULT_NEXT = "/delivery-agents/list";

// Admin login: email + password → POST /api/admin/login. The API's own message is shown on failure.
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    try {
      await authService.login(values.email.trim(), values.password);
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/") ? next : DEFAULT_NEXT);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Login failed. Please try again.");
    }
  };

  return (
    <section className="login-card" aria-labelledby="login-title">
      {/* Brand */}
      <div className="login-brand">
        <span className="app-sidebar-logo" aria-hidden="true">
          E
        </span>
        <div>
          <h1 className="login-title" id="login-title">
            Easy Admin
          </h1>
          <p className="login-subtitle">Sign in with your admin account</p>
        </div>
      </div>

      <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Server-side error, e.g. "Invalid credentials" */}
        {serverError && <Message severity="error" text={serverError} className="form-message" />}

        <div className="form-field">
          <label className="form-label" htmlFor="login-email">
            Email
          </label>
          <InputText
            id="login-email"
            type="email"
            autoComplete="username"
            className={errors.email ? "p-invalid" : undefined}
            {...register("email", {
              required: "Email is required",
              pattern: { value: AGENT_RULES.email.pattern, message: "Please provide a valid email address" },
            })}
          />
          {errors.email && <small className="form-error">{errors.email.message}</small>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="login-password">
            Password
          </label>
          <InputText
            id="login-password"
            type="password"
            autoComplete="current-password"
            className={errors.password ? "p-invalid" : undefined}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <small className="form-error">{errors.password.message}</small>}
        </div>

        <Button type="submit" label={isSubmitting ? "Signing in…" : "Sign in"} icon="pi pi-sign-in" loading={isSubmitting} disabled={isSubmitting} />
      </form>
    </section>
  );
}

export default function LoginPage() {
  // useSearchParams needs a Suspense boundary for static prerendering
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, AlertCircle, KeyRound } from "lucide-react";
import { AuthHeader } from "./AuthHeader";
import { AuthTabs } from "./AuthTabs";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { FormInput } from "./FormInput";
import { PasswordField } from "./PasswordField";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { loginSchema } from "../schemas/login.schema";
import { useLoginMutation } from "../hooks/useLoginMutation";
import { useGoogleAuthMutation } from "../hooks/useGoogleAuthMutation";
import { resolveDashboardRoute } from "../constants/auth.constants";
import type { LoginPayload } from "../types/auth.types";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const googleMutation = useGoogleAuthMutation();

  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    // 1. Zod Validation
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    // 2. React Query login mutation
    loginMutation.mutate(validation.data, {
      onSuccess: (response) => {
        const role = response?.data?.user?.role || response?.data?.role;
        const targetPath = resolveDashboardRoute(role);
        router.push(targetPath);
      },
      onError: (err) => {
        setServerError(err.message || "Invalid email or password.");
      },
    });
  };

  // Google OAuth Credential Handler
  const handleGoogleCredential = (credential: string) => {
    setServerError(null);
    googleMutation.mutate(
      { credential },
      {
        onSuccess: (response) => {
          const role = response?.data?.user?.role || response?.data?.role;
          const targetPath = resolveDashboardRoute(role);
          router.push(targetPath);
        },
        onError: (err) => {
          setServerError(
            err.message || "Google sign-in failed. Please try again or create an account."
          );
        },
      }
    );
  };

  return (
    <div className="relative w-full max-w-[450px] mx-auto rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-white/12 p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(2,6,23,0.7)] text-white animate-in fade-in zoom-in-95 duration-300">
      {/* 1. Official MeLife Brand Header */}
      <AuthHeader />

      {/* 2. Segmented Tabs (Sign In vs Create Account) */}
      <AuthTabs activeTab="login" />

      {/* 3. Continue with Google Social CTA (Google Identity Services) */}
      <div className="mb-3.5">
        <GoogleAuthButton
          onCredentialReceived={handleGoogleCredential}
          isLoading={googleMutation.isPending}
        />
      </div>

      {/* 4. Divider with OR */}
      <div className="relative flex items-center justify-center my-3.5">
        <div className="w-full border-t border-slate-700/80" />
        <span className="absolute px-3 bg-slate-900/90 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          OR
        </span>
      </div>

      {/* 5. Server Error Alert Banner */}
      {serverError && (
        <div
          className="mb-3.5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2 animate-in fade-in duration-150"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <span>{serverError}</span>
        </div>
      )}

      {/* 6. Form Fields */}
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <FormInput
          id="login-email"
          name="email"
          type="email"
          label="Email address"
          placeholder="name@example.com"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <PasswordField
          id="login-password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          rightElement={
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-[#00BFA5] hover:text-[#00C896] hover:underline"
            >
              Forgot password?
            </Link>
          }
        />

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#00BFA5] focus:ring-[#00BFA5]/40 accent-[#00BFA5]"
            />
            <span className="text-xs text-slate-300 hover:text-white">
              Remember me
            </span>
          </label>
        </div>

        {/* Submit Primary CTA */}
        <div className="pt-1.5">
          <AuthSubmitButton
            isLoading={loginMutation.isPending}
            loadingText="Signing in..."
          >
            Sign in
          </AuthSubmitButton>
        </div>
      </form>

      {/* 7. Footer Secondary Options */}
      <div className="mt-5 pt-3.5 border-t border-slate-800 space-y-2 text-center text-xs text-slate-300">
        <div>
          <span>Don&apos;t have an account? </span>
          <Link
            href="/register"
            className="font-bold text-[#00BFA5] hover:text-[#00C896] hover:underline"
          >
            Create an account
          </Link>
        </div>

        <div className="pt-0.5">
          <Link
            href="/voucher"
            className="inline-flex items-center gap-1.5 font-medium text-slate-400 hover:text-white transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Have an assessment access code?</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

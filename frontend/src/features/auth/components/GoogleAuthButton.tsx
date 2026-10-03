"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

interface GoogleAuthButtonProps {
  onCredentialReceived: (credential: string) => void;
  isLoading?: boolean;
  className?: string;
  text?: string;
}

let activeGoogleCallback: ((credential: string) => void) | null = null;
let isGisInitialized = false;

export function GoogleAuthButton({
  onCredentialReceived,
  isLoading = false,
  className,
  text = "Continue with Google",
}: GoogleAuthButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Keep the active module-level callback pointer updated to the currently mounted/focused button handler
  useEffect(() => {
    activeGoogleCallback = onCredentialReceived;
    return () => {
      if (activeGoogleCallback === onCredentialReceived) {
        activeGoogleCallback = null;
      }
    };
  }, [onCredentialReceived]);

  const renderGoogleButton = useCallback(() => {
    if (!window.google?.accounts?.id || !clientId || !containerRef.current) return;

    // 1. Initialize Google Identity Services once globally with the active dispatcher callback
    if (!isGisInitialized) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response?.credential && activeGoogleCallback) {
              activeGoogleCallback(response.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        isGisInitialized = true;
      } catch (err) {
        console.warn("Google Identity Services initialization warning:", err);
      }
    }

    // 2. Render native Google button iframe cleanly
    try {
      containerRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: 380,
      });
    } catch (err) {
      console.warn("Google Identity Services renderButton warning:", err);
    }
  }, [clientId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          renderGoogleButton();
        }
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [renderGoogleButton]);

  return (
    <div className={cn("relative w-full overflow-hidden rounded-xl", className)}>
      {/* 1. Visually Styled 3G MeLife Branded Custom Button */}
      <div
        className={cn(
          "w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#172B2A] bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/90 active:bg-slate-100",
          "transition-all duration-150 flex items-center justify-center gap-2.5 shadow-2xs select-none pointer-events-none"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#00BFA5]" />
        ) : (
          <svg
            className="w-4 h-4 shrink-0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
        )}
        <span>{isLoading ? "Authenticating with Google..." : text}</span>
      </div>

      {/* 2. Transparent Native Google Button Overlay for 100% Genuine User Click Gestures (Zero FedCM Aborts) */}
      {!isLoading && (
        <div
          ref={containerRef}
          className="absolute inset-0 z-10 w-full h-full opacity-[0.001] cursor-pointer overflow-hidden flex items-center justify-center scale-125"
          title={text}
        />
      )}
    </div>
  );
}

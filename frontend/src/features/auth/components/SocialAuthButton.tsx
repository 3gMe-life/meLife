"use client";

import React from "react";
import { GoogleAuthButton } from "./GoogleAuthButton";

interface SocialAuthButtonProps {
  onClick?: () => void;
  onCredentialReceived?: (credential: string) => void;
  isLoading?: boolean;
  className?: string;
  text?: string;
}

export function SocialAuthButton({
  onClick,
  onCredentialReceived,
  isLoading = false,
  className,
  text,
}: SocialAuthButtonProps) {
  if (onCredentialReceived) {
    return (
      <GoogleAuthButton
        onCredentialReceived={onCredentialReceived}
        isLoading={isLoading}
        className={className}
        text={text}
      />
    );
  }

  return (
    <GoogleAuthButton
      onCredentialReceived={() => {
        if (onClick) onClick();
      }}
      isLoading={isLoading}
      className={className}
      text={text}
    />
  );
}

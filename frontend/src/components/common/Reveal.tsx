"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right" | "zoom-in";
  delay?: number; // delay in ms
  duration?: number; // duration in ms
}

export function Reveal({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 600,
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getAnimationStyles = () => {
    if (!isVisible) {
      switch (animation) {
        case "fade-up":
          return "opacity-0 translate-y-6";
        case "fade-in":
          return "opacity-0";
        case "fade-left":
          return "opacity-0 translate-x-6";
        case "fade-right":
          return "opacity-0 -translate-x-6";
        case "zoom-in":
          return "opacity-0 scale-95";
        default:
          return "opacity-0 translate-y-6";
      }
    }
    return "opacity-100 translate-y-0 translate-x-0 scale-100";
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={cn("transition-all", getAnimationStyles(), className)}
    >
      {children}
    </div>
  );
}

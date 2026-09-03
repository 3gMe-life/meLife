import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  showText?: boolean;
}

export function Logo({
  className,
  size = "md",
  href = "/",
  showText = true,
}: LogoProps) {
  const sizeMap = {
    sm: { imgSize: 36, textSize: "text-lg", subSize: "text-[10px]" },
    md: { imgSize: 44, textSize: "text-xl", subSize: "text-xs" },
    lg: { imgSize: 56, textSize: "text-2xl", subSize: "text-sm" },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={cn("inline-flex items-center gap-3 select-none group", className)}>
      <div className="relative overflow-hidden rounded-xl shadow-[0_2px_10px_rgba(0,191,165,0.2)] border border-[#00BFA5]/30 bg-white transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/melifelogo.png"
          alt="3G ME LIFE - Psychometric Assessment & Career Guidance"
          width={currentSize.imgSize}
          height={currentSize.imgSize}
          priority
          className="object-cover"
        />
      </div>
      {showText && (
        <div className="flex flex-col text-left">
          <span className={cn("font-bold tracking-tight text-[#172B2A] leading-none", currentSize.textSize)}>
            3G ME LIFE
          </span>
          <span className={cn("font-medium text-[#008F83] tracking-wider uppercase mt-0.5", currentSize.subSize)}>
            Psychometric Guidance
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5] rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}

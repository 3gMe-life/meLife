"use client";

import React from "react";
import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";
import { MessageDeliveryStatus } from "../types/messaging.types";

interface MessageStatusProps {
  status: MessageDeliveryStatus;
  className?: string;
}

export const MessageStatus: React.FC<MessageStatusProps> = ({
  status,
  className = "",
}) => {
  switch (status) {
    case "SENDING":
      return (
        <span title="Sending..." className={`inline-flex items-center text-slate-400 ${className}`}>
          <Clock className="w-3 h-3 animate-spin" />
        </span>
      );
    case "SENT":
      return (
        <span title="Sent" className={`inline-flex items-center text-slate-400 ${className}`}>
          <Check className="w-3 h-3 stroke-[2.5]" />
        </span>
      );
    case "DELIVERED":
      return (
        <span title="Delivered" className={`inline-flex items-center text-slate-400 ${className}`}>
          <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
        </span>
      );
    case "READ":
      return (
        <span title="Read" className={`inline-flex items-center text-[#00BFA5] dark:text-[#00BFA5] ${className}`}>
          <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
        </span>
      );
    case "FAILED":
      return (
        <span title="Failed to send" className={`inline-flex items-center text-rose-500 ${className}`}>
          <AlertCircle className="w-3 h-3" />
        </span>
      );
    default:
      return null;
  }
};

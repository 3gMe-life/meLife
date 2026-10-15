/**
 * Zod validation schemas for messaging operations
 */

import { z } from "zod";

export const createConversationSchema = z.object({
  counsellorId: z.string().uuid("Invalid counsellor identifier").optional(),
  studentId: z.string().uuid("Invalid student identifier").optional(),
}).refine(
  (data) => Boolean(data.counsellorId || data.studentId),
  { message: "Either counsellorId or studentId must be provided" }
);

export const sendMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message content cannot be empty")
    .max(4000, "Message content exceeds maximum allowed length of 4000 characters"),
  clientMessageId: z
    .string()
    .uuid("Invalid clientMessageId UUID")
    .optional(),
  messageType: z.literal("TEXT").default("TEXT"),
});

export const getMessagesQuerySchema = z.object({
  before: z.string().datetime({ offset: true }).optional().or(z.string().optional()),
  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(30),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GetMessagesQueryInput = z.infer<typeof getMessagesQuerySchema>;

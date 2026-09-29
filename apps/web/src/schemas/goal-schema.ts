import z from "zod";

export const goalIdSchema = z.object({
  id: z.string(),
});

export const goalStatusEnum = z.enum([
  "active",
  "waiting",
  "completed",
  "confirm",
  "unintended",
]);

export const goalSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  status: goalStatusEnum,
  collection: goalIdSchema.nullable(),
  description: z.string().nullable(),
});

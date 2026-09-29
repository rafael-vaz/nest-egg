import { z } from "zod";

export const collectionIdSchema = z.object({
  id: z.string(),
});

export const collectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  goals: z.array(collectionIdSchema).nullable(),
  description: z.string().nullable(),
});

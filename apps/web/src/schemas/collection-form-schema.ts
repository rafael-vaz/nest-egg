import { z } from "zod";

import { goalSchema } from "./goal-schema";

const collectionFormSchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório." }).min(5, {
    message: "O nome deve ter pelo menos 5 caracteres.",
  }),
  description: z.string().nullable(),
  goals: z.array(goalSchema).nullable(),
});

export type CollectionFormData = z.infer<typeof collectionFormSchema>;
export default collectionFormSchema;

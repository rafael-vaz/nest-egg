import { z } from "zod";

import { collectionSchema } from "./collection-schema";

const goalFormSchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório." }).min(5, {
    message: "O nome deve ter pelo menos 5 caracteres.",
  }),
  value: z
    .number({ required_error: "O valor é obrigatório." })
    .gt(0, { message: "O valor deve ser maior que 0." }),
  status: z.enum(["active", "waiting", "completed", "confirm", "unintended"], {
    errorMap: () => ({ message: "O tipo selecionado é inválido." }),
  }),
  collection: collectionSchema.nullable(),
  description: z.string().nullable(),
});

export type GoalFormData = z.infer<typeof goalFormSchema>;
export default goalFormSchema;

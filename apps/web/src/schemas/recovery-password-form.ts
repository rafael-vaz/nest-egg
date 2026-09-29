import { z } from "zod";

const recoveryPasswordFormSchema = z.object({
  email: z
    .string({ required_error: "O e-mail é obrigatório." })
    .email({ message: "Informe um e-mail válido." }),
});

export type RecoveryPasswordFormData = z.infer<
  typeof recoveryPasswordFormSchema
>;
export default recoveryPasswordFormSchema;

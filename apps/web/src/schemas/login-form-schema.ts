import { z } from "zod";

const loginFormSchema = z.object({
  email: z
    .string({ required_error: "O e-mail é obrigatório." })
    .email({ message: "Informe um e-mail válido." }),
  password: z
    .string({ required_error: "A senha é obrigatória." })
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export default loginFormSchema;

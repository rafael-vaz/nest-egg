import { z } from "zod";

const registerFormSchema = z
  .object({
    name: z.string({ required_error: "O nome é obrigatório." }).min(8, {
      message: "O nome deve ter pelo menos 8 caracteres.",
    }),
    email: z
      .string({ required_error: "O e-mail é obrigatório." })
      .email({ message: "Informe um e-mail válido." }),
    dateOfBirth: z
      .date({
        required_error: "Informe a data de nascimento.",
        invalid_type_error: "Informe a data de nascimento.",
      })
      .refine((date) => date <= new Date(), {
        message: "A data de nascimento não pode ser no futuro.",
      }),
    password: z
      .string({ required_error: "A senha é obrigatória." })
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
      .regex(/[A-Z]/, {
        message: "A senha deve conter ao menos uma letra maiúscula.",
      })
      .regex(/[a-z]/, {
        message: "A senha deve conter ao menos uma letra minúscula.",
      })
      .regex(/[0-9]/, {
        message: "A senha deve conter ao menos um número.",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "A senha deve conter ao menos um caractere especial.",
      }),
    confirmPassword: z.string({ required_error: "Confirme sua senha" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem.",
  });
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export default registerFormSchema;

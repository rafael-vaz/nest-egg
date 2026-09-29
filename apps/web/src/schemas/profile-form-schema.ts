import { z } from "zod";

const profileFormSchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório." }).min(8, {
    message: "O nome deve ter pelo menos 8 caracteres.",
  }),
  wallet: z
    .number({ required_error: "O valor é obrigatório." })
    .gt(0, { message: "O valor deve ser maior que 0." }),
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
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
export default profileFormSchema;

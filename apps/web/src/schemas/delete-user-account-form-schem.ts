import { z } from "zod";

const deleteUserAccountFormSchema = z.object({
  password: z
    .string({ required_error: "A senha é obrigatória." })
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
});

export type DeleteUserAccountFormData = z.infer<
  typeof deleteUserAccountFormSchema
>;
export default deleteUserAccountFormSchema;

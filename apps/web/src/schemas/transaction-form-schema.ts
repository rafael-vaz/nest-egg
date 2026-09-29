import { z } from "zod";

export const transactionCategoryEnum = z.enum([
  "food",
  "housing",
  "transport",
  "health",
  "education",
  "leisure",
  "shopping",
  "services",
  "subscriptions",
  "travel",
  "debts",
  "investment",
  "income",
  "gifts",
  "taxes",
  "pets",
  "personalCare",
  "technology",
  "savings",
  "other",
]);

export const transactionTypeSchema = z.enum(["debt", "credit"]);

const transactionFormSchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório." }).min(5, {
    message: "O nome deve ter pelo menos 5 caracteres.",
  }),
  value: z
    .number({ required_error: "O valor é obrigatório." })
    .gt(0, { message: "O valor deve ser maior que 0." }),
  type: transactionTypeSchema,
  date: z.date(),
  category: transactionCategoryEnum,
  description: z.string().nullable(),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;
export default transactionFormSchema;

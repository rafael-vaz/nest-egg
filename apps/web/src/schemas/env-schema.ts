import { z } from "zod";

export const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1, "API key is required"),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, "Auth domain is required"),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, "Project ID is required"),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1, "Storage bucket is required"),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, "Messaging sender ID is required"),
  VITE_FIREBASE_APP_ID: z.string().min(1, "App ID is required"),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().min(1, "Measurement ID is required"),
});

const envCheck = envSchema.safeParse(import.meta.env);

if (!envCheck.success) {
  console.error("Invalid environment variables:", envCheck.error.format());
  throw new Error("Failed to validate environment variables.");
}

export const env = envCheck.data;

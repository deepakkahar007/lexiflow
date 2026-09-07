import { z } from "zod";

const envSchema = z.object({
  VITE_SERVER_URL: z.url().trim(),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  throw new Error("Invalid environment variables", {
    cause: parsedEnv.error,
  });
}

export const env = parsedEnv.data;

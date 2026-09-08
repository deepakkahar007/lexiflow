import { env } from "@/lib/env";

export const getHome = async () => {
  const res = await fetch(`${env.VITE_SERVER_URL}/health`);
  return await res.json();
};

export const uploadPdf = async (file: File) => {
  const formData = new FormData();
  formData.append("files", file);
  const res = await fetch(`${env.VITE_SERVER_URL}/document/upload`, {
    method: "POST",
    body: formData,
  });
  return await res.json();
};

type LoginResponse = {
  status?: string;
  token?: string;
  [key: string]: unknown;
};

export const userLogin = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const res = await fetch(`${env.VITE_SERVER_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return await res.json();
};

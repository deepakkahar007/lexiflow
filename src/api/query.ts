import { env } from "@/lib/env";
import type { AllNotebookResponseType } from "./apiResponseType";

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
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return await res.json();
};

export const userLogout = async () => {
  const res = await fetch(`${env.VITE_SERVER_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return await res.json();
};

export const getAllNotebooksById = async (
  id: string | undefined = "bf906298-12b3-4c67-ae95-f4fc4be1a953",
): Promise<AllNotebookResponseType[]> => {
  const res = await fetch(`${env.VITE_SERVER_URL}/document/list/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return await res.json();
};

export const deleteNotebookById = async (id: string) => {
  const res = await fetch(`${env.VITE_SERVER_URL}/notebook/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return await res.json();
};

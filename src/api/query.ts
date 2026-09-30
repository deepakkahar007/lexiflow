import { apiFetch } from "./client";
import type { SessionUser } from "@/types/auth";
import type { AllNotebookResponseType } from "./apiResponseType";

export type LoginResponse = {
  status: boolean;
  message: string;
};

export type LogoutResponse = {
  status: boolean;
  message: string;
};

export type RegisterResponse = {
  status: boolean;
  message: string;
};

export type CreateNotebookResponse = {
  status: boolean;
  id: string | null;
  message: string | null;
  error: string | null;
};

export type DeleteResponse = {
  status: boolean;
  message: string;
};

export type UploadResponse = {
  status: boolean;
  id?: string;
  error?: string;
};

export type DocumentListItem = {
  id: string;
  original_filename: string;
  status: string;
};

export type DocumentListResponse = {
  status: boolean;
  message?: string;
  count: number;
  documents: DocumentListItem[];
};

export const getHome = async () => {
  return apiFetch<{ status: string }>("/health");
};

export const userLogin = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const userRegister = async (values: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(values),
  });
};

export const userLogout = async (): Promise<LogoutResponse> => {
  return apiFetch<LogoutResponse>("/auth/logout", { method: "POST" });
};

/** Resolves to null when nobody is signed in (the 401 case). */
export const getUser = async (): Promise<SessionUser> => {
  return apiFetch<SessionUser>("/auth/me");
};

export const getMyNotebooks = async () => {
  return apiFetch<{
    status: boolean;
    message: string;
    count: number;
    notebook: {
      id: string;
      name: string;
      description: string | null;
      updated_at: string;
    }[];
  }>("/notebook/user/me");
};

export const createNotebook = async (values: {
  name: string;
  description?: string;
}): Promise<CreateNotebookResponse> => {
  // user_id is no longer sent: the server derives the owner from the cookie.
  return apiFetch<CreateNotebookResponse>("/notebook/create", {
    method: "POST",
    body: JSON.stringify(values),
  });
};

export const deleteNotebookById = async (id: string): Promise<DeleteResponse> => {
  return apiFetch<DeleteResponse>(`/notebook/${id}`, { method: "DELETE" });
};

export const getDocumentsByNotebookId = async (
  notebookId: string,
): Promise<DocumentListResponse> => {
  return apiFetch<DocumentListResponse>(`/document/list/${notebookId}`);
};

export const deleteDocumentById = async (id: string): Promise<DeleteResponse> => {
  return apiFetch<DeleteResponse>(`/document/delete/${id}`, { method: "DELETE" });
};

export const uploadPdf = async (
  file: File,
  notebookId: string,
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("files", file);
  formData.append("notebook_id", notebookId);

  return apiFetch<UploadResponse>("/document/upload", {
    method: "POST",
    body: formData,
  });
};

export type { AllNotebookResponseType };
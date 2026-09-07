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

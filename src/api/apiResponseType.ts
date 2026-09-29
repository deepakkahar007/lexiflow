export type AllNotebookResponseType = {
  id: string;
  name: string;
  description: string;
  user_id: string;
};

export type GetAllNotebookByUserIdResponse = {
  status: boolean;
  message: string | null;
  count: number;
  error: string | null;
  notebook: {
    id: string;
    name: string;
    description: string;
    updated_at: string;
  }[];
};

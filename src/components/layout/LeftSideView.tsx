import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDocumentById, getDocumentsByNotebookId } from "@/api/query";
import { useAuthStore } from "@/store/useAuthStore";
import LogoutButton from "../forms/LogoutButton";
import UploadForm from "../forms/UploadForm";
import { Button } from "../ui/button";

const LeftSideView = ({ notebookId }: { notebookId: string }) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const { data, isLoading } = useQuery({
    queryKey: ["documents", notebookId],
    queryFn: () => getDocumentsByNotebookId(notebookId),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-document"],
    mutationFn: (id: string) => deleteDocumentById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", notebookId] });
    },
  });

  return (
    <div className="w-64 border-r">
      <p>{user?.name}</p>

      <UploadForm notebookId={notebookId} />

      <hr />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="my-4">
          {data?.documents.map((item) => {
            return (
              <section key={item.id} className=" gap-2 border-b py-2">
                <p>{item.original_filename}</p>
                <p>{item.status}</p>
                <Button
                  variant="destructive"
                  onClick={() => mutate(item.id)}
                  disabled={isPending}
                >
                  Delete
                </Button>
              </section>
            );
          })}
        </div>
      )}

      <LogoutButton />
    </div>
  );
};

export default LeftSideView;
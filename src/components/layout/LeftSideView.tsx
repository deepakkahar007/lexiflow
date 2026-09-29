import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDocumentById, getAllNotebooksById } from "@/api/query";
import LogoutButton from "../forms/LogoutButton";
import UploadForm from "../forms/UploadForm";
import { Button } from "../ui/button";

const LeftSideView = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notebooks"],
    queryFn: () => getAllNotebooksById("bf906298-12b3-4c67-ae95-f4fc4be1a953"),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-document"],
    mutationFn: (id: string) => deleteDocumentById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
    },
  });

  return (
    <div className="w-64 border-r">
      <p>LeftSideView</p>

      <UploadForm />

      <hr />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="my-4">
          {data?.documents.map((item: any) => {
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

import { createFileRoute, Link } from "@tanstack/react-router";
import CreateNotebookForm from "@/components/forms/CreateNotebookForm";
import { deleteNotebookById, getAllNotebooksById } from "@/api/query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/notebook/")({
  component: NotebookIndex,
});

function NotebookIndex() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notebooks"],
    queryFn: () => getAllNotebooksById(),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-notebook"],
    mutationFn: (id: string) => deleteNotebookById(id),
    onSuccess: () => {
      // Refresh the notebooks list
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notebooks</h3>
        <CreateNotebookForm />
      </div>

      {data?.length === 0 ? (
        <div className="my-4">
          <p>No notebooks found</p>
        </div>
      ) : (
        <div>
          {data?.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-2"
              >
                <Link to="/notebook/$id" params={{ id: item.id }}>
                  <Button>{item.name}</Button>
                </Link>
                <Button
                  onClick={() => mutate(item.id)}
                  variant={"destructive"}
                  disabled={isPending}
                >
                  Delete
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import CreateNotebookForm from "@/components/forms/CreateNotebookForm";
import { deleteNotebookById, getAllNotebookByUserId } from "@/api/query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getUser } from "@/api/query";

export const Route = createFileRoute("/notebook/")({
  component: NotebookIndex,
  beforeLoad: async () => {
    const res = await getUser();
    console.log(res);
  },
});

function NotebookIndex() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notebooks"],
    queryFn: () => getAllNotebookByUserId(),
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

      {data?.notebook.length === 0 ? (
        <div className="my-4">
          <p>No notebooks found</p>
        </div>
      ) : (
        <div>
          {data?.notebook.map((item, index) => {
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

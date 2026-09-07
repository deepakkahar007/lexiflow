import CreateNotebookForm from "@/components/forms/CreateNotebookForm";
import UploadForm from "@/components/forms/UploadForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>

      <CreateNotebookForm />

      <UploadForm />
    </div>
  );
}

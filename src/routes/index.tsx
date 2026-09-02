import CreateNotebookForm from "@/components/forms/CreateNotebookForm";
import UploadForm from "@/components/forms/UploadForm";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  async function handleTest() {
    try {
      const res = await fetch("http://localhost:8000/health");
      const data = await res.json();
      console.log(data);
    } catch (err: Error | unknown) {
      console.error(err);
    }
  }

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button onClick={handleTest}>Click me</Button>
      <CreateNotebookForm />

      <UploadForm />
    </div>
  );
}

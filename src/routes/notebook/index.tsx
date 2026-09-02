import { createFileRoute } from "@tanstack/react-router";

import CreateNotebookForm from "@/components/forms/CreateNotebookForm";

export const Route = createFileRoute("/notebook/")({
  component: NotebookIndex,
});

function NotebookIndex() {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notebooks</h3>
        <CreateNotebookForm />
      </div>
    </div>
  );
}

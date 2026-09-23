import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const notebookSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().optional(),
});

type NotebookFormValues = z.infer<typeof notebookSchema>;

type CreateNotebookResponse = {
  status: boolean;
  id: string;
  message?: string;
};

async function createNotebook(
  values: NotebookFormValues,
): Promise<CreateNotebookResponse> {
  const body = {
    user_id: "9d527de0-ec93-478b-b6b3-798727e26739",
    ...values,
  };

  const response = await fetch("http://localhost:8000/notebook/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    try {
      const error = await response.json();

      if (typeof error?.detail === "string") {
        message = error.detail;
      } else if (typeof error?.message === "string") {
        message = error.message;
      }
    } catch {
      // Keep the default HTTP error message when the response isn't JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

const CreateNotebookForm = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const createMutation = useMutation({
    mutationKey: ["create-notebook"],
    mutationFn: createNotebook,
    onSuccess: (data) => {
      if (data.status) {
        toast.success("Notebook created successfully.");
        setOpen(false);
        navigate({ to: `/notebook/${data.id}` });
      } else {
        toast.error(data.message ?? "Failed to create notebook.");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    } satisfies NotebookFormValues,
    onSubmit: async ({ value }) => {
      const result = notebookSchema.safeParse(value);

      if (!result.success) {
        return;
      }

      await createMutation.mutateAsync(result.data);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Create Notebook</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Notebook</DialogTitle>
          <DialogDescription>
            Enter a name and optional description for your new notebook.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result = notebookSchema.shape.name.safeParse(value);

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
              onSubmit: ({ value }) => {
                const result = notebookSchema.shape.name.safeParse(value);

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>

                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="My Notebook"
                  disabled={createMutation.isPending}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Description</Label>

                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Optional description"
                  disabled={createMutation.isPending}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={createMutation.isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNotebookForm;

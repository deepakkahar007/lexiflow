import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPdf } from "@/api/query";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const pdfSchema = z
  .file({
    message: "Please select a PDF file.",
  })
  .nullable()
  .refine((file) => file === null || file.type === "application/pdf", {
    message: "Only PDF files are allowed.",
  })
  .refine((file) => file === null || file.size <= MAX_FILE_SIZE, {
    message: "The PDF must be smaller than 10 MB.",
  });

const uploadSchema = z.object({
  file: pdfSchema,
});

type UploadFormValues = z.infer<typeof uploadSchema>;

type UploadResponse = {
  message?: string;
  [key: string]: unknown;
};

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationKey: ["upload-document"],
    mutationFn: uploadPdf,
  });

  const form = useForm({
    defaultValues: {
      file: null as File | null,
    } satisfies UploadFormValues,
    onSubmit: async ({ value }) => {
      console.log(value);
      const result = uploadSchema.safeParse(value);

      if (!result.success) {
        return;
      }

      if (result.data.file === null) {
        return;
      }

      const response = await uploadMutation.mutateAsync(result.data.file);
      console.log("response ", response);
    },
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: {
      handleChange: (value: File | null) => void;
    },
  ) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    uploadMutation.reset();
    field.handleChange(file);
  };

  return (
    <div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
          <CardDescription>Select a PDF document to upload.</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <form.Field
              name="file"
              validators={{
                onChange: ({ value }) => {
                  if (value === null) {
                    return "Please select a PDF file.";
                  }
                  const result = uploadSchema.shape.file.safeParse(value);

                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
                onSubmit: ({ value }) => {
                  if (value === null) {
                    return "Please select a PDF file.";
                  }
                  const result = uploadSchema.shape.file.safeParse(value);

                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>PDF document</Label>

                  <Input
                    id={field.name}
                    name={field.name}
                    type="file"
                    accept="application/pdf,.pdf"
                    disabled={uploadMutation.isPending}
                    onChange={(event) => handleFileChange(event, field)}
                  />

                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name}
                    </p>
                  )}

                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {uploadMutation.isSuccess && (
              <p className="text-sm text-green-600">
                {uploadMutation.data?.message ?? "PDF uploaded successfully."}
              </p>
            )}

            {uploadMutation.isError && (
              <p className="text-sm text-destructive">
                {uploadMutation.error.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload PDF"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadForm;

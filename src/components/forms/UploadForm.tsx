import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Loader2Icon, UploadIcon } from "lucide-react";

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

const UploadForm = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationKey: ["upload-document"],
    mutationFn: uploadPdf,
    onSuccess: () => {
      setOpen(false);
      setSelectedFile(null);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
    },
  });

  const handleUpload = () => {
    const result = pdfSchema.safeParse(selectedFile);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid file.");
      return;
    }

    setError(null);
    uploadMutation.mutate(result.data!);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <UploadIcon className="mr-2 size-4" />
        Upload Document
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF</DialogTitle>
          <DialogDescription>
            Select a PDF document to upload.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="file">PDF document</Label>

          <Input
            id="file"
            type="file"
            accept="application/pdf,.pdf"
            disabled={uploadMutation.isPending}
            onChange={(event) => {
              setSelectedFile(event.target.files?.[0] ?? null);
              setError(null);
              uploadMutation.reset();
            }}
          />

          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFile.name}
            </p>
          )}

          {(error || uploadMutation.isError) && (
            <p className="text-sm text-destructive">
              {error ?? uploadMutation.error?.message}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            ) : null}
            {uploadMutation.isPending ? "Uploading..." : "Upload PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadForm;

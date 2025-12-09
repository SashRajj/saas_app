"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Link as LinkIcon,
  Edit3,
  Loader2,
  Check,
  X,
  AlertCircle,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  type: "pdf" | "url" | "text";
  status: "uploading" | "processing" | "ready" | "error";
  progress?: number;
  error?: string;
}

interface KnowledgeUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingFiles: UploadedFile[];
  onUpload: (files: UploadedFile[]) => void;
}

export function KnowledgeUploadModal({
  open,
  onOpenChange,
  existingFiles,
  onUpload,
}: KnowledgeUploadModalProps) {
  const [activeTab, setActiveTab] = useState<"pdf" | "url" | "text">("pdf");
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateUpload = async (file: UploadedFile) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, progress, status: "uploading" as const } : f
        )
      );
    }

    // Simulate processing
    setFiles((prev) =>
      prev.map((f) =>
        f.id === file.id ? { ...f, status: "processing" as const } : f
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mark as ready
    setFiles((prev) =>
      prev.map((f) =>
        f.id === file.id ? { ...f, status: "ready" as const } : f
      )
    );
  };

  const handleFileDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (f) =>
          f.type === "application/pdf" ||
          f.type === "text/plain" ||
          f.name.endsWith(".docx")
      );

      for (const file of droppedFiles) {
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: "pdf",
          status: "uploading",
          progress: 0,
        };
        setFiles((prev) => [...prev, newFile]);
        await simulateUpload(newFile);
      }
    },
    []
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    for (const file of selectedFiles) {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: "pdf",
        status: "uploading",
        progress: 0,
      };
      setFiles((prev) => [...prev, newFile]);
      await simulateUpload(newFile);
    }
  };

  const handleAddUrl = async () => {
    if (!urlInput.trim()) return;

    const newFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: urlInput,
      type: "url",
      status: "uploading",
      progress: 0,
    };
    setFiles((prev) => [...prev, newFile]);
    setUrlInput("");
    await simulateUpload(newFile);
  };

  const handleAddText = async () => {
    if (!textInput.trim()) return;

    const newFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: textTitle || "Custom Text",
      type: "text",
      status: "uploading",
      progress: 0,
    };
    setFiles((prev) => [...prev, newFile]);
    setTextInput("");
    setTextTitle("");
    await simulateUpload(newFile);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSave = () => {
    onUpload(files.filter((f) => f.status === "ready"));
    onOpenChange(false);
  };

  const readyCount = files.filter((f) => f.status === "ready").length;
  const processingCount = files.filter(
    (f) => f.status === "uploading" || f.status === "processing"
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Knowledge Base
          </DialogTitle>
          <DialogDescription>
            Upload documents to help your AI answer questions about your business
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Add URL
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Write Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdf" className="mt-4">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium mb-1">Drag & drop files here</p>
              <p className="text-sm text-muted-foreground mb-4">
                PDF, TXT, or DOCX (max 10MB)
              </p>
              <Button variant="outline" asChild>
                <label className="cursor-pointer">
                  <File className="h-4 w-4 mr-2" />
                  Browse Files
                  <input
                    type="file"
                    accept=".pdf,.txt,.docx"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="url" className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Website URL
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/about"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddUrl();
                  }}
                />
                <Button onClick={handleAddUrl} disabled={!urlInput.trim()}>
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                We&apos;ll scrape the page content and add it to your knowledge base
              </p>
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="e.g., Service Pricing, FAQ, Hours"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                placeholder="Enter information about your business, services, pricing, FAQs, etc."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            <Button onClick={handleAddText} disabled={!textInput.trim()}>
              <Edit3 className="h-4 w-4 mr-1" />
              Add to Knowledge Base
            </Button>
          </TabsContent>
        </Tabs>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">
                Documents ({readyCount} ready
                {processingCount > 0 && `, ${processingCount} processing`})
              </h4>
            </div>
            <div className="max-h-[200px] overflow-y-auto space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {file.type === "pdf" && (
                      <FileText className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                    {file.type === "url" && (
                      <LinkIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    )}
                    {file.type === "text" && (
                      <Edit3 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {file.status === "uploading" && (
                      <div className="w-20">
                        <Progress value={file.progress} className="h-1" />
                      </div>
                    )}
                    {file.status === "processing" && (
                      <Badge variant="secondary" className="text-xs">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Processing
                      </Badge>
                    )}
                    {file.status === "ready" && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-100 text-green-700"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Ready
                      </Badge>
                    )}
                    {file.status === "error" && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Error
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={processingCount > 0}>
            {processingCount > 0 ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                Save ({readyCount} documents)
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

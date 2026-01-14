"use client";

import type React from "react";

import { useCallback, useState } from "react";
import { Upload, FileText, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export function FileUploadZone({
  onFileSelect,
  selectedFile,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && isValidFileType(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && isValidFileType(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const isValidFileType = (file: File) => {
    const validTypes = ["text/plain", "application/pdf"];
    return (
      validTypes.includes(file.type) ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".pdf")
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (selectedFile) {
    return (
      <div className="border-2 border-foreground rounded-lg p-4 bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            {selectedFile.name.endsWith(".pdf") ? (
              <FileText className="w-6 h-6 text-primary" />
            ) : (
              <File className="w-6 h-6 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {selectedFile.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFileSelect(null as unknown as File)}
            className="shrink-0"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Remover arquivo</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-foreground hover:border-primary hover:bg-primary/5"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="sr-only"
        accept=".txt,.pdf,text/plain,application/pdf"
        onChange={handleFileInput}
      />

      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-7 h-7 text-primary" />
        </div>

        <div>
          <p className="font-medium text-foreground mb-1">
            Arraste e solte seu arquivo aqui
          </p>
          <p className="text-sm text-muted-foreground">
            Formatos aceitos: .txt ou .pdf
          </p>
        </div>

        <label htmlFor="file-upload">
          <Button
            variant="outline"
            className="border-2 border-foreground cursor-pointer bg-transparent"
            asChild
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Arquivo
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}

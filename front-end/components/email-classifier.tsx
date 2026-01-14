"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  Send,
  Mail,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadZone } from "@/components/file-upload-zone";

export function EmailClassifier() {
  const [inputMethod, setInputMethod] = useState<"upload" | "text">("upload");
  const [emailText, setEmailText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canProcess =
    inputMethod === "upload" ? file !== null : emailText.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <header className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
          Classificador de Emails
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
          Analise emails automaticamente e receba sugestões de resposta
          inteligentes
        </p>
      </header>

      {/* Step 1: Input Method Selection */}
      <Card className="p-6 md:p-8 mb-6 border-2 border-foreground bg-card">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-2">
          Passo 1: Entrada do Email
        </h2>
        <p className="text-muted-foreground mb-6">
          Escolha como deseja enviar o email para análise
        </p>

        {/* Method Toggle */}
        <div className="flex gap-3 mb-6">
          <Button
            variant={inputMethod === "upload" ? "default" : "outline"}
            onClick={() => {
              setInputMethod("upload");
            }}
            className="flex-1 border-2 border-foreground"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload de Arquivo
          </Button>
          <Button
            variant={inputMethod === "text" ? "default" : "outline"}
            onClick={() => {
              setInputMethod("text");
            }}
            className="flex-1 border-2 border-foreground"
          >
            <FileText className="w-4 h-4 mr-2" />
            Digitar Texto
          </Button>
        </div>

        {/* Input Area */}
        {inputMethod === "upload" ? (
          <FileUploadZone onFileSelect={() => {}} selectedFile={file} />
        ) : (
          <div className="space-y-2">
            <label
              htmlFor="email-text"
              className="text-sm font-medium uppercase tracking-wide"
            >
              Conteúdo do Email:
            </label>
            <Textarea
              id="email-text"
              placeholder="Cole ou digite o conteúdo do email aqui..."
              className="min-h-[200px] border-2 border-foreground resize-none"
              value={emailText}
              onChange={(e) => {
                setEmailText(e.target.value);
              }}
            />
            <p className="text-xs text-muted-foreground">
              {emailText.length} caracteres
            </p>
          </div>
        )}

        {/* Process Button */}
        <div className="flex gap-3 mt-6">
          <Button
            disabled={!canProcess || isProcessing}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-foreground"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                Processando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Analisar Email
              </>
            )}
          </Button>
          {(file || emailText) && (
            <Button
              variant="outline"
              className="border-2 border-foreground bg-transparent"
              size="lg"
            >
              Limpar
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

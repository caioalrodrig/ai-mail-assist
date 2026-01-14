"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Mail,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ResultCard } from "@/components/result-card";

type ClassificationResult = {
  category: "produtivo" | "improdutivo";
  confidence: number;
  suggestedResponse: string;
};

export function EmailClassifier() {
  const [inputMethod, setInputMethod] = useState<"upload" | "text">("upload");
  const [emailText, setEmailText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
  }, []);

  const handleProcess = async () => {
    setIsProcessing(true);
    setResult(null);

    // Simulate API processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock result - TO-DO: call the AI API 
    const mockResult: ClassificationResult = {
      category: Math.random() > 0.5 ? "produtivo" : "improdutivo",
      confidence: 85 + Math.random() * 14,
      suggestedResponse:
        Math.random() > 0.5
          ? "Prezado(a),\n\nAgradecemos seu contato. Sua solicitação foi recebida e será analisada por nossa equipe. Retornaremos em até 48 horas úteis com uma resposta detalhada.\n\nAtenciosamente,\nEquipe de Atendimento"
          : "Prezado(a),\n\nAgradecemos seu email. Infelizmente, não podemos dar seguimento a esta solicitação no momento, pois ela não se enquadra em nossos critérios de atendimento.\n\nCaso tenha outras dúvidas, estamos à disposição.\n\nAtenciosamente,\nEquipe de Atendimento",
    };

    setResult(mockResult);
    setIsProcessing(false);
  };

  const canProcess =
    inputMethod === "upload" ? file !== null : emailText.trim().length > 0;

  const handleReset = () => {
    setFile(null);
    setEmailText("");
    setResult(null);
  };

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
              setResult(null);
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
              setResult(null);
            }}
            className="flex-1 border-2 border-foreground"
          >
            <FileText className="w-4 h-4 mr-2" />
            Digitar Texto
          </Button>
        </div>

        {/* Input Area */}
        {inputMethod === "upload" ? (
          <FileUploadZone onFileSelect={handleFileSelect} selectedFile={file} />
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
                setResult(null);
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
            onClick={handleProcess}
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
              onClick={handleReset}
              className="border-2 border-foreground bg-transparent"
              size="lg"
            >
              Limpar
            </Button>
          )}
        </div>
      </Card>

      {/* Step 2: Results */}
      {(result || isProcessing) && (
        <Card className="p-6 md:p-8 border-2 border-foreground bg-card">
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-2">
            Passo 2: Resultado da Análise
          </h2>
          <p className="text-muted-foreground mb-6">
            Classificação e resposta sugerida pelo sistema
          </p>

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">
                Analisando conteúdo do email...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Classification Badge */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    result.category === "produtivo"
                      ? "bg-success/10 border-success"
                      : "bg-destructive/10 border-destructive"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.category === "produtivo" ? (
                      <CheckCircle className="w-8 h-8 text-success" />
                    ) : (
                      <XCircle className="w-8 h-8 text-destructive" />
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Categoria
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          result.category === "produtivo"
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {result.category === "produtivo"
                          ? "Produtivo"
                          : "Improdutivo"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 rounded-lg border-2 border-foreground/20 bg-muted/50">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Confiança
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {result.confidence.toFixed(1)}%
                  </p>
                  <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Suggested Response */}
              <ResultCard
                title="Resposta Sugerida"
                content={result.suggestedResponse}
              />
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
}

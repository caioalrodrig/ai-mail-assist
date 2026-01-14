"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultCardProps {
  title: string;
  content: string;
}

export function ResultCard({ title, content }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-2 border-primary rounded-lg overflow-hidden">
      <div className="bg-primary/10 px-4 py-3 flex items-center justify-between border-b-2 border-primary">
        <h3 className="font-bold uppercase text-sm tracking-wide text-foreground">
          {title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-foreground hover:bg-primary/20"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copiar
            </>
          )}
        </Button>
      </div>
      <div className="p-4 bg-card">
        <p className="whitespace-pre-wrap text-foreground leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}

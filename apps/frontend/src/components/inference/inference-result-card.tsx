'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Terminal, Cpu, Clock } from 'lucide-react';
import type { InferenceResultDto } from '@/types/inference';
import { toast } from 'sonner';

interface InferenceResultCardProps {
  result: InferenceResultDto;
}

export function InferenceResultCard({ result }: InferenceResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      toast.success('Copied output to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy text');
    }
  };

  const tokensPerSec =
    result.inferenceTimeMs && result.tokensUsed
      ? ((result.tokensUsed / result.inferenceTimeMs) * 1000).toFixed(1)
      : null;

  return (
    <Card className="overflow-hidden border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10">
      <CardContent className="p-6 space-y-4">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Terminal className="h-4 w-4" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">Output</span>
          </div>
          {result.output && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>

        {/* Output text */}
        <div className="min-h-[100px] whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground select-text break-words">
          {result.output || (
            <span className="text-muted-foreground italic">No output text generated</span>
          )}
        </div>

        {/* Metrics bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-emerald-500/10 pt-3 text-xs text-muted-foreground">
          {result.tokensUsed !== null && (
            <div className="flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-emerald-500" />
              <span>
                Tokens: <strong className="text-foreground">{result.tokensUsed}</strong>
              </span>
            </div>
          )}
          {result.inferenceTimeMs !== null && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-emerald-500" />
              <span>
                Time: <strong className="text-foreground">{result.inferenceTimeMs}ms</strong>
              </span>
            </div>
          )}
          {tokensPerSec && (
            <div className="flex items-center gap-1 border-l border-emerald-500/10 pl-6">
              <span>
                Speed: <strong className="text-foreground">{tokensPerSec} t/s</strong>
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

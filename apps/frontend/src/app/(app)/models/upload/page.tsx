'use client';

import { useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Upload,
  FileCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Hash,
  Link2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ConnectWalletButton } from '@/components/wallet/connect-wallet-button';
import { useWalletStore } from '@/store/wallet.store';
import { useUploadModel } from '@/hooks/use-models';
import { ROUTES } from '@/constants/routes';
import type { MintResultDto } from '@/types/model';

// ── Constants ─────────────────────────────────────────────────────────────────

const ALLOWED_EXTENSIONS = ['.pt', '.pth', '.onnx', '.gguf', '.safetensors'];
const MAX_SIZE_MB = 500;

const UPLOAD_STAGES = [
  { key: 'UPLOADING_FILE', label: 'Uploading model to IPFS…', progress: 25 },
  { key: 'UPLOADING_METADATA', label: 'Uploading metadata to IPFS…', progress: 50 },
  { key: 'MINTING', label: 'Minting NFT on Monad…', progress: 75 },
  { key: 'COMPLETED', label: 'Done!', progress: 100 },
] as const;

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  modelId: z.string().min(1, 'Model is required'),
  version: z
    .string()
    .min(1, 'Version is required')
    .regex(/^\d+\.\d+\.\d+$/, 'Must be a semantic version (e.g. 1.0.0)'),
  changelog: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ── Component ─────────────────────────────────────────────────────────────────

function UploadModelForm() {
  const searchParams = useSearchParams();
  const defaultModelId = searchParams.get('modelId') ?? '';

  const { address, isConnected } = useWalletStore();
  const uploadMutation = useUploadModel();

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [stage, setStage] = useState<string | null>(null);
  const [result, setResult] = useState<MintResultDto | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { modelId: defaultModelId, version: '1.0.0' },
  });

  // ── File handling ─────────────────────────────────────────────────────────

  function validateFile(f: File): boolean {
    setFileError(null);
    const ext = `.${f.name.split('.').pop()?.toLowerCase() ?? ''}`;
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError(`Unsupported file type "${ext}". Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return false;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`File too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      return false;
    }
    return true;
  }

  function handleFileSelect(f: File) {
    if (validateFile(f)) setFile(f);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────

  async function onSubmit(values: FormValues) {
    if (!file) {
      toast.error('Please select a model file.');
      return;
    }
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('modelId', values.modelId);
    formData.append('version', values.version);
    formData.append('walletAddress', address);
    if (values.changelog) formData.append('changelog', values.changelog);

    setStage('UPLOADING_FILE');

    try {
      const mintResult = await uploadMutation.mutateAsync(formData);
      setResult(mintResult);
      setStage('COMPLETED');
      toast.success('NFT minted successfully!');
    } catch (err) {
      setStage(null);
      const msg = err instanceof Error ? err.message : 'Upload failed';
      toast.error('Upload failed', { description: msg });
    }
  }

  // ── Progress ──────────────────────────────────────────────────────────────

  const currentStage = UPLOAD_STAGES.find((s) => s.key === stage);
  const progress = currentStage?.progress ?? 0;
  const isUploading = uploadMutation.isPending;

  // ── Success screen ────────────────────────────────────────────────────────

  if (result) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader className="text-center pb-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <CardTitle className="text-xl">Model Successfully Uploaded!</CardTitle>
            <CardDescription>
              Your AI model is now on IPFS and minted as an NFT on Monad Testnet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow
              icon={<Hash className="h-4 w-4" />}
              label="NFT Token ID"
              value={`#${result.nftTokenId}`}
            />
            <InfoRow
              icon={<Link2 className="h-4 w-4" />}
              label="File CID"
              value={result.fileCid}
              mono
            />
            <InfoRow
              icon={<Link2 className="h-4 w-4" />}
              label="Metadata CID"
              value={result.metadataCid}
              mono
            />
            <InfoRow
              icon={<Hash className="h-4 w-4" />}
              label="SHA-256"
              value={result.sha256}
              mono
            />
            <InfoRow icon={<ExternalLink className="h-4 w-4" />} label="Transaction">
              <a
                href={`https://monad-testnet.socialscan.io/tx/${result.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-primary hover:underline break-all"
              >
                {result.txHash}
              </a>
            </InfoRow>
            <div className="pt-4 flex gap-3">
              <Button asChild className="flex-1">
                <Link href={ROUTES.MODEL_DETAIL(result.modelId)}>View Model</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setFile(null);
                  setStage(null);
                }}
              >
                Upload Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Upload form ───────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="gap-1 -ml-2">
        <Link href={ROUTES.MARKETPLACE}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Model</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your AI model file to IPFS and mint it as an NFT on Monad Testnet.
        </p>
      </div>

      {/* Wallet */}
      {!isConnected ? (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="flex items-center justify-between pt-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Connect your wallet to upload and mint an NFT.
            </p>
            <ConnectWalletButton />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="flex items-center justify-between pt-4">
            <p className="text-sm text-green-700 dark:text-green-400">
              Wallet connected: <span className="font-mono">{address?.slice(0, 10)}…</span>
            </p>
            <ConnectWalletButton />
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* File drop zone */}
        <Card>
          <CardContent className="pt-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
                dragOver
                  ? 'border-primary bg-primary/5'
                  : file
                    ? 'border-green-500 bg-green-500/5'
                    : 'border-muted-foreground/30 hover:border-primary/50'
              }`}
            >
              {file ? (
                <div className="space-y-1">
                  <FileCheck className="mx-auto h-10 w-10 text-green-500" />
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Click to upload</span> or drag and
                    drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ALLOWED_EXTENSIONS.join(', ')} · Max {MAX_SIZE_MB} MB
                  </p>
                </div>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept={ALLOWED_EXTENSIONS.join(',')}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
            />
            {fileError && (
              <div className="mt-2 flex items-center gap-2 text-xs text-destructive">
                <XCircle className="h-3.5 w-3.5" />
                {fileError}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Version Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="modelId">Model ID</Label>
              <Input id="modelId" placeholder="Enter model ID…" {...register('modelId')} />
              {errors.modelId && (
                <p className="text-xs text-destructive">{errors.modelId.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="version">Version</Label>
              <Input id="version" placeholder="1.0.0" {...register('version')} />
              {errors.version && (
                <p className="text-xs text-destructive">{errors.version.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="changelog">Changelog (optional)</Label>
              <Textarea
                id="changelog"
                placeholder="Describe what changed in this version…"
                rows={3}
                {...register('changelog')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {isUploading && (
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{currentStage?.label ?? 'Processing…'}</span>
                <span className="text-xs text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="space-y-1">
                {UPLOAD_STAGES.map((s) => {
                  const done = (currentStage?.progress ?? 0) > s.progress;
                  const active = s.key === stage;
                  return (
                    <div
                      key={s.key}
                      className={`flex items-center gap-2 text-xs ${active ? 'text-primary font-medium' : done ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}
                    >
                      {active ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : done ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-current" />
                      )}
                      {s.label}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          type="submit"
          className="w-full gap-2"
          size="lg"
          disabled={isUploading || !isConnected}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {currentStage?.label ?? 'Processing…'}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload & Mint NFT
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
  mono = false,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {children ?? (
          <p className={`break-all ${mono ? 'font-mono text-xs' : 'font-medium'}`}>{value}</p>
        )}
      </div>
    </div>
  );
}

export default function UploadModelPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl pt-12 text-center text-muted-foreground space-y-3">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Loading upload page details...</p>
        </div>
      }
    >
      <UploadModelForm />
    </Suspense>
  );
}

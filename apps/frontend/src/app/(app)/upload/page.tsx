import type { Metadata } from 'next';
import { Upload, FileUp, Info } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Upload Model',
  description: 'Publish your AI model as an NFT on the decentralized marketplace.',
};

const steps = [
  {
    step: 1,
    title: 'Connect Wallet',
    description: 'Connect your MetaMask wallet to authenticate and sign transactions.',
    status: 'pending',
  },
  {
    step: 2,
    title: 'Upload Model Weights',
    description: 'Upload your model file — it will be stored on IPFS and pinned for availability.',
    status: 'pending',
  },
  {
    step: 3,
    title: 'Add Metadata',
    description: 'Describe your model: name, category, version, license, and pricing.',
    status: 'pending',
  },
  {
    step: 4,
    title: 'Mint NFT',
    description: 'Sign the mintNFT transaction on Monad. Your model becomes a tradeable NFT.',
    status: 'pending',
  },
];

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Upload className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Model</h1>
          <p className="text-sm text-muted-foreground">
            Publish your AI model as an NFT on Monad blockchain
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The upload form will be available after wallet integration is complete{' '}
          <Badge variant="outline" className="ml-1 text-xs">
            Sprint 5
          </Badge>
        </AlertDescription>
      </Alert>

      {/* Upload flow steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Publishing Flow</CardTitle>
          <CardDescription>4-step process to publish your model on the marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {steps.map((item) => (
              <li key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-muted-foreground">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Placeholder form area */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-primary/40 bg-primary/5">
            <FileUp className="h-6 w-6 text-primary/60" />
          </div>
          <p className="mt-4 text-sm font-medium">Upload form coming in Sprint 5</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Drag & drop model files (.pkl, .pt, .onnx) or click to browse
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

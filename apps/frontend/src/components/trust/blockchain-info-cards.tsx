'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hash, FileCode, Landmark, ExternalLink, Copy, Check, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface BlockchainInfoCardsProps {
  nftTokenId?: string | null;
  fileCid?: string | null;
  txHash?: string | null;
  ownerAddress?: string | null;
}

export function BlockchainInfoCards({
  nftTokenId,
  fileCid,
  txHash,
  ownerAddress,
}: BlockchainInfoCardsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(`${key} panoya kopyalandı`);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error('Kopyalanamadı');
    }
  };

  const hasData = nftTokenId || fileCid || txHash || ownerAddress;

  if (!hasData) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
          <Shield className="h-8 w-8 opacity-35" />
          <p className="text-sm font-semibold">Zincir Dışı Model</p>
          <p className="text-xs">
            Bu model sürümü henüz zincire kaydedilmemiş veya NFT olarak basılmamış.
          </p>
        </CardContent>
      </Card>
    );
  }

  const items = [
    {
      key: 'NFT Token ID',
      value: nftTokenId ? `#${nftTokenId}` : null,
      rawValue: nftTokenId || '',
      icon: Hash,
      description: "Monad'daki model varlığının benzersiz ERC-721 token tanımlayıcısı.",
    },
    {
      key: 'IPFS Dosya CID',
      value: fileCid
        ? `${fileCid.substring(0, 10)}...${fileCid.substring(fileCid.length - 8)}`
        : null,
      rawValue: fileCid || '',
      icon: FileCode,
      description: "IPFS'te depolanan model ağırlıklarına işaret eden içerik tanımlayıcısı.",
      link: `${process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? 'https://ipfs.io/ipfs'}/${fileCid}`,
    },
    {
      key: "İşlem Hash'i",
      value: txHash ? `${txHash.substring(0, 10)}...${txHash.substring(txHash.length - 8)}` : null,
      rawValue: txHash || '',
      icon: Landmark,
      description: "Modelin zincire kaydedildiği andaki işlem hash'i.",
      link: `https://monad-testnet.socialscan.io/tx/${txHash}`,
    },
    {
      key: 'Yaratıcı Cüzdan',
      value: ownerAddress
        ? `${ownerAddress.substring(0, 8)}...${ownerAddress.substring(ownerAddress.length - 6)}`
        : null,
      rawValue: ownerAddress || '',
      icon: Shield,
      description: 'NFT basımı sırasında kaydedilen model yaratıcısının Web3 adresi.',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        if (!item.value) return null;
        const Icon = item.icon;
        const isCopied = copiedKey === item.key;

        return (
          <Card
            key={item.key}
            className="flex flex-col justify-between hover:border-primary/20 transition-colors"
          >
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  {item.key}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleCopy(item.rawValue, item.key)}
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  {item.link && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex-1 flex flex-col justify-between">
              <div className="font-mono text-sm font-semibold text-foreground truncate select-all">
                {item.value}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1.5 leading-normal">
                {item.description}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

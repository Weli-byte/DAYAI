import { Injectable } from '@nestjs/common';

export interface ModelMetadata {
  name: string;
  description: string;
  framework: string;
  task?: string;
  version: string;
  parameters?: number;
  author: string;
  license?: string;
  tags: string[];
  createdAt: string;
  // IPFS references
  fileCid: string;
  fileSize: number;
  sha256: string;
  // NFT image placeholder
  image: string;
}

@Injectable()
export class MetadataService {
  build(input: {
    name: string;
    description?: string | null;
    framework: string;
    version: string;
    author: string;
    license?: string | null;
    tags: string[];
    fileCid: string;
    fileSize: number;
    sha256: string;
  }): ModelMetadata {
    return {
      name: input.name,
      description: input.description ?? '',
      framework: input.framework,
      version: input.version,
      author: input.author,
      license: input.license ?? 'All rights reserved',
      tags: input.tags,
      fileCid: input.fileCid,
      fileSize: input.fileSize,
      sha256: input.sha256,
      createdAt: new Date().toISOString(),
      // Default placeholder — marketplace will render this
      image: `ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi`,
    };
  }

  toBuffer(metadata: ModelMetadata): Buffer {
    return Buffer.from(JSON.stringify(metadata, null, 2), 'utf-8');
  }
}

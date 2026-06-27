import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { type ConfigService } from '@nestjs/config';

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

@Injectable()
export class IPFSService {
  private readonly logger = new Logger(IPFSService.name);
  private readonly pinataApiUrl = 'https://api.pinata.cloud';

  constructor(private readonly config: ConfigService) {}

  private get jwt(): string {
    return this.config.getOrThrow<string>('PINATA_JWT');
  }

  private get gateway(): string {
    return this.config.get<string>('IPFS_GATEWAY', 'https://gateway.pinata.cloud/ipfs');
  }

  /**
   * Upload a raw file buffer to IPFS via Pinata.
   * Returns the IPFS CID (v0 Qm… hash).
   */
  async uploadFile(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    this.logger.log(`Uploading file to IPFS: ${fileName} (${buffer.length} bytes)`);

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    formData.append('file', blob, fileName);
    formData.append('pinataMetadata', JSON.stringify({ name: fileName }));
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

    const response = await fetch(`${this.pinataApiUrl}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.jwt}` },
      body: formData,
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`Pinata file upload failed: ${response.status} ${body}`);
      throw new InternalServerErrorException('Failed to upload file to IPFS');
    }

    const data = (await response.json()) as PinataResponse;
    this.logger.log(`File pinned: ${data.IpfsHash}`);
    return data.IpfsHash;
  }

  /**
   * Upload a JSON metadata object to IPFS via Pinata.
   * Returns the IPFS CID.
   */
  async uploadJson(metadata: object, name: string): Promise<string> {
    this.logger.log(`Uploading metadata JSON to IPFS: ${name}`);

    const body = JSON.stringify({
      pinataMetadata: { name },
      pinataOptions: { cidVersion: 0 },
      pinataContent: metadata,
    });

    const response = await fetch(`${this.pinataApiUrl}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.jwt}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    if (!response.ok) {
      const errBody = await response.text();
      this.logger.error(`Pinata JSON upload failed: ${response.status} ${errBody}`);
      throw new InternalServerErrorException('Failed to upload metadata to IPFS');
    }

    const data = (await response.json()) as PinataResponse;
    this.logger.log(`Metadata pinned: ${data.IpfsHash}`);
    return data.IpfsHash;
  }

  /** Returns a public HTTP gateway URL for a given CID. */
  buildGatewayUrl(cid: string): string {
    return `${this.gateway}/${cid}`;
  }

  /** Returns the canonical ipfs:// URI for a given CID. */
  buildIpfsUri(cid: string): string {
    return `ipfs://${cid}`;
  }
}

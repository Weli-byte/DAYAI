import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './services/upload.service';
import { IPFSService } from './services/ipfs.service';
import { MetadataService } from './services/metadata.service';
import { BlockchainService } from './services/blockchain.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, IPFSService, MetadataService, BlockchainService],
  exports: [BlockchainService],
})
export class UploadModule {}

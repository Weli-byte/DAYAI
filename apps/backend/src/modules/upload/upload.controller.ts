import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { type UploadService } from './services/upload.service';
import { type UploadModelDto } from './dto/upload-model.dto';
import { MintResponseDto, UploadJobResponseDto } from './dto/upload-response.dto';
import { memoryStorage } from 'multer';

// 500 MB
const MAX_FILE_BYTES = 500 * 1024 * 1024;

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * POST /api/v1/upload/model
   * Upload a model file + metadata, pin to IPFS, mint NFT on Monad.
   */
  @Post('model')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload AI model file, pin to IPFS and mint NFT' })
  @ApiBody({
    description: 'Multipart form: model file + JSON fields',
    schema: {
      type: 'object',
      required: ['file', 'modelId', 'version', 'walletAddress'],
      properties: {
        file: { type: 'string', format: 'binary' },
        modelId: { type: 'string' },
        version: { type: 'string', example: '1.0.0' },
        walletAddress: { type: 'string', example: '0x...' },
        changelog: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, type: MintResponseDto })
  async uploadModel(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: MAX_FILE_BYTES })],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: UploadModelDto,
  ): Promise<MintResponseDto> {
    return this.uploadService.uploadAndMint(file, dto);
  }

  /**
   * GET /api/v1/upload/jobs/:jobId
   * Poll upload/mint job status.
   */
  @Get('jobs/:jobId')
  @ApiOperation({ summary: 'Get upload job status' })
  @ApiParam({ name: 'jobId', description: 'Upload job ID' })
  @ApiResponse({ status: 200, type: UploadJobResponseDto })
  async getJobStatus(@Param('jobId') jobId: string): Promise<UploadJobResponseDto> {
    return this.uploadService.getJobStatus(jobId);
  }
}

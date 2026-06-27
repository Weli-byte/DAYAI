import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { type InferenceService } from './inference.service';
import { type RunInferenceDto } from './dto/run-inference.dto';
import { InferenceResultDto } from './dto/inference-result.dto';
import {
  type QueryInferenceHistoryDto,
  PaginatedInferenceHistoryDto,
} from './dto/inference-history.dto';

@ApiTags('inference')
@Controller('inference')
export class InferenceController {
  constructor(private readonly inferenceService: InferenceService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Run inference on an AI model' })
  @ApiOkResponse({ type: InferenceResultDto, description: 'Inference executed successfully' })
  @ApiNotFoundResponse({ description: 'Model not found' })
  @ApiInternalServerErrorResponse({ description: 'Inference execution failed' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async runInference(@Body() dto: RunInferenceDto): Promise<InferenceResultDto> {
    return this.inferenceService.runInference(dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get paginated inference history for a wallet address' })
  @ApiOkResponse({
    type: PaginatedInferenceHistoryDto,
    description: 'History retrieved successfully',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getHistory(
    @Query() query: QueryInferenceHistoryDto,
  ): Promise<PaginatedInferenceHistoryDto> {
    return this.inferenceService.getHistory(query);
  }

  @Get('history/:id')
  @ApiOperation({ summary: 'Get a single inference log detail' })
  @ApiOkResponse({ type: InferenceResultDto, description: 'Inference log found' })
  @ApiNotFoundResponse({ description: 'Inference log not found' })
  async getById(@Param('id') id: string): Promise<InferenceResultDto> {
    return this.inferenceService.getById(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { type ModelsService } from './models.service';
import { type CreateModelDto } from './dto/create-model.dto';
import { type UpdateModelDto } from './dto/update-model.dto';
import { type QueryModelDto } from './dto/query-model.dto';
import { ModelResponseDto, PaginatedModelResponseDto } from './dto/model-response.dto';

@ApiTags('Models')
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  @ApiOperation({ summary: 'List AI models with pagination, search, filter and sort' })
  @ApiResponse({ status: 200, type: PaginatedModelResponseDto })
  findAll(@Query() query: QueryModelDto): Promise<PaginatedModelResponseDto> {
    return this.modelsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single AI model by ID' })
  @ApiParam({ name: 'id', description: 'Model ID' })
  @ApiResponse({ status: 200, type: ModelResponseDto })
  @ApiResponse({ status: 404, description: 'Model not found' })
  findOne(@Param('id') id: string): Promise<ModelResponseDto> {
    return this.modelsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new AI model' })
  @ApiResponse({ status: 201, type: ModelResponseDto })
  create(@Body() dto: CreateModelDto): Promise<ModelResponseDto> {
    return this.modelsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an AI model' })
  @ApiParam({ name: 'id', description: 'Model ID' })
  @ApiResponse({ status: 200, type: ModelResponseDto })
  @ApiResponse({ status: 404, description: 'Model not found' })
  update(@Param('id') id: string, @Body() dto: UpdateModelDto): Promise<ModelResponseDto> {
    return this.modelsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete an AI model' })
  @ApiParam({ name: 'id', description: 'Model ID' })
  @ApiResponse({ status: 204, description: 'Model deleted' })
  @ApiResponse({ status: 404, description: 'Model not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.modelsService.remove(id);
  }
}

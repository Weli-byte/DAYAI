import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { type TagsService } from './tags.service';
import { type CreateTagDto } from './dto/create-tag.dto';
import { TagResponseDto } from './dto/tag-response.dto';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'List all tags' })
  @ApiResponse({ status: 200, type: [TagResponseDto] })
  findAll(): Promise<TagResponseDto[]> {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single tag' })
  @ApiResponse({ status: 200, type: TagResponseDto })
  findOne(@Param('id') id: string): Promise<TagResponseDto> {
    return this.tagsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a tag' })
  @ApiResponse({ status: 201, type: TagResponseDto })
  create(@Body() dto: CreateTagDto): Promise<TagResponseDto> {
    return this.tagsService.create(dto);
  }
}

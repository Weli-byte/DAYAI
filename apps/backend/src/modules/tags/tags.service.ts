import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { type PrismaService } from '../database/prisma.service';
import type { CreateTagDto } from './dto/create-tag.dto';
import type { TagResponseDto } from './dto/tag-response.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TagResponseDto[]> {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string): Promise<TagResponseDto> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag "${id}" not found.`);
    return tag;
  }

  async create(dto: CreateTagDto): Promise<TagResponseDto> {
    const existing = await this.prisma.tag.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Tag with slug "${dto.slug}" already exists.`);
    return this.prisma.tag.create({ data: dto });
  }
}

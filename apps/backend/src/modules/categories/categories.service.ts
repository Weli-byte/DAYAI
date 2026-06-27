import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { type PrismaService } from '../database/prisma.service';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories;
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException(`Category "${id}" not found.`);
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const existing = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Category with slug "${dto.slug}" already exists.`);

    return this.prisma.category.create({ data: dto });
  }
}

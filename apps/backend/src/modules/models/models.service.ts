import { Injectable, NotFoundException } from '@nestjs/common';
import { type ModelRepository, type ModelWithRelations } from './repositories/model.repository';
import type { CreateModelDto } from './dto/create-model.dto';
import type { UpdateModelDto } from './dto/update-model.dto';
import type { QueryModelDto } from './dto/query-model.dto';
import type { ModelResponseDto, PaginatedModelResponseDto, TagDto } from './dto/model-response.dto';
import type { Framework, ModelStatus } from '../common/types/enums';

@Injectable()
export class ModelsService {
  constructor(private readonly repo: ModelRepository) {}

  async findAll(query: QueryModelDto): Promise<PaginatedModelResponseDto> {
    const { data, total, page, limit } = await this.repo.findMany(query);

    return {
      data: data.map((m: ModelWithRelations) => this.toDto(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<ModelResponseDto> {
    const model = await this.repo.findById(id);
    if (!model) throw new NotFoundException(`Model with id "${id}" not found.`);
    return this.toDto(model);
  }

  async create(dto: CreateModelDto): Promise<ModelResponseDto> {
    const model = await this.repo.create({
      title: dto.title,
      description: dto.description,
      framework: dto.framework,
      status: dto.status,
      license: dto.license,
      ownerId: dto.ownerId,
      categoryId: dto.categoryId,
      tagIds: dto.tagIds,
    });
    return this.toDto(model);
  }

  async update(id: string, dto: UpdateModelDto): Promise<ModelResponseDto> {
    await this.findOne(id);
    const model = await this.repo.update(id, {
      title: dto.title,
      description: dto.description,
      framework: dto.framework,
      status: dto.status,
      license: dto.license,
      categoryId: dto.categoryId,
      tagIds: dto.tagIds,
    });
    return this.toDto(model);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.softDelete(id);
  }

  // ── Private mapper ─────────────────────────────────────────────────────────

  private toDto(model: ModelWithRelations): ModelResponseDto {
    const latestVersion = model.versions?.[0] ?? null;

    return {
      id: model.id,
      title: model.title,
      description: model.description,
      framework: model.framework as Framework,
      status: model.status as ModelStatus,
      license: model.license,
      owner: model.owner
        ? { id: model.owner.id, username: model.owner.username, avatar: model.owner.avatar }
        : undefined,
      category: model.category
        ? { id: model.category.id, name: model.category.name, slug: model.category.slug }
        : null,
      tags: model.tags.map(
        (mt: { tag: { id: string; name: string; slug: string } }): TagDto => ({
          id: mt.tag.id,
          name: mt.tag.name,
          slug: mt.tag.slug,
        }),
      ),
      latestVersion: latestVersion
        ? {
            id: latestVersion.id,
            version: latestVersion.version,
            changelog: latestVersion.changelog,
            isLatest: latestVersion.isLatest,
            createdAt: latestVersion.createdAt,
          }
        : null,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}

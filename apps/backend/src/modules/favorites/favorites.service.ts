import { Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FavoriteRepository } from './repositories/favorite.repository';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProfilesService } from '../profiles/profiles.service';
import type { CreateFavoriteDto } from './dto/create-favorite.dto';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly profilesService: ProfilesService,
    private readonly prisma: PrismaService,
  ) {}

  async addFavorite(dto: CreateFavoriteDto) {
    const model = await this.prisma.aIModel.findUnique({
      where: { id: dto.modelId, deletedAt: null },
    });
    if (!model) {
      throw new NotFoundException(`Model with ID '${dto.modelId}' not found.`);
    }

    const user = await this.profilesService.getOrCreateUserByWallet(dto.walletAddress);
    return this.favoriteRepository.add(dto.modelId, user.id);
  }

  async removeFavorite(modelId: string, walletAddress: string) {
    const user = await this.profilesService.getOrCreateUserByWallet(walletAddress);
    try {
      await this.favoriteRepository.remove(modelId, user.id);
      return { success: true };
    } catch {
      throw new NotFoundException(`Favorite not found or already removed.`);
    }
  }

  async getFavorites(walletAddress: string, page = 1, limit = 20) {
    const user = await this.profilesService.getOrCreateUserByWallet(walletAddress);
    const { data, total } = await this.favoriteRepository.findManyByUser(user.id, page, limit);

    // Format models similar to list DTOs
    const items = data.map((fav) => {
      const m = fav.model;
      return {
        id: m.id,
        title: m.title,
        description: m.description,
        framework: m.framework,
        status: m.status,
        license: m.license,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        owner: m.owner,
        category: m.category,
        tags: m.tags.map((t: any) => t.tag),
        latestVersion: m.versions[0] || null,
      };
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async isFavorite(modelId: string, walletAddress: string): Promise<{ isFavorite: boolean }> {
    const user = await this.profilesService.getOrCreateUserByWallet(walletAddress);
    const isFav = await this.favoriteRepository.isFavorite(modelId, user.id);
    return { isFavorite: isFav };
  }
}

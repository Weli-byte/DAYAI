import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ReviewRepository } from './repositories/review.repository';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProfilesService } from '../profiles/profiles.service';
import type { CreateReviewDto } from './dto/create-review.dto';
import type { UpdateReviewDto } from './dto/update-review.dto';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly profilesService: ProfilesService,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateReviewDto) {
    const model = await this.prisma.aIModel.findUnique({
      where: { id: dto.modelId, deletedAt: null },
    });
    if (!model) {
      throw new NotFoundException(`Model with ID '${dto.modelId}' not found.`);
    }

    const user = await this.profilesService.getOrCreateUserByWallet(dto.walletAddress);

    const review = await this.reviewRepository.create(dto.modelId, user.id, dto.content);
    return this.mapToResponse(review);
  }

  async update(id: string, dto: UpdateReviewDto) {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException(`Review with ID '${id}' not found.`);
    }

    const user = await this.profilesService.getOrCreateUserByWallet(dto.walletAddress);

    if (review.userId !== user.id) {
      throw new ForbiddenException('You can only update your own reviews.');
    }

    const updated = await this.reviewRepository.update(id, dto.content);
    return this.mapToResponse(updated);
  }

  async delete(id: string, walletAddress: string) {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException(`Review with ID '${id}' not found.`);
    }

    const user = await this.profilesService.getOrCreateUserByWallet(walletAddress);

    if (review.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own reviews.');
    }

    await this.reviewRepository.delete(id);
    return { success: true };
  }

  async findManyByModel(modelId: string, page = 1, limit = 20) {
    const model = await this.prisma.aIModel.findUnique({
      where: { id: modelId, deletedAt: null },
    });
    if (!model) {
      throw new NotFoundException(`Model with ID '${modelId}' not found.`);
    }

    const { data, total } = await this.reviewRepository.findManyByModel(modelId, page, limit);

    return {
      items: data.map((item) => this.mapToResponse(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private mapToResponse(item: any) {
    return {
      id: item.id,
      modelId: item.modelId,
      content: item.content,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      user: {
        id: item.user.id,
        username: item.user.username,
        avatar: item.user.avatar,
        walletAddress: item.user.profile?.walletAddress || null,
      },
    };
  }
}

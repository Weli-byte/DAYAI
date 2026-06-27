import { Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { RatingRepository } from './repositories/rating.repository';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProfilesService } from '../profiles/profiles.service';
import type { CreateRatingDto } from './dto/create-rating.dto';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class RatingsService {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly profilesService: ProfilesService,
    private readonly prisma: PrismaService,
  ) {}

  async rateModel(dto: CreateRatingDto) {
    // 1. Verify model exists
    const model = await this.prisma.aIModel.findUnique({
      where: { id: dto.modelId, deletedAt: null },
    });
    if (!model) {
      throw new NotFoundException(`Model with ID '${dto.modelId}' not found.`);
    }

    // 2. Resolve wallet to user
    const user = await this.profilesService.getOrCreateUserByWallet(dto.walletAddress);

    // 3. Upsert rating
    return this.ratingRepository.upsert(dto.modelId, user.id, dto.value);
  }

  async getRatingSummary(modelId: string) {
    const model = await this.prisma.aIModel.findUnique({
      where: { id: modelId, deletedAt: null },
    });
    if (!model) {
      throw new NotFoundException(`Model with ID '${modelId}' not found.`);
    }

    return this.ratingRepository.getSummary(modelId);
  }

  async getUserRating(modelId: string, walletAddress: string) {
    const user = await this.profilesService.getOrCreateUserByWallet(walletAddress);
    return this.ratingRepository.getUserRating(modelId, user.id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProfileRepository } from './repositories/profile.repository';
import type { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfileByUserId(userId: string) {
    const user = await this.profileRepository.findByUserId(userId);
    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found.`);
    }
    return user;
  }

  async getOrCreateUserByWallet(walletAddress: string) {
    return this.profileRepository.getOrCreateUserByWallet(walletAddress);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.profileRepository.findByUserId(userId);
    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found.`);
    }
    return this.profileRepository.update(userId, dto);
  }
}

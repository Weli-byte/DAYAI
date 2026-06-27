import { Injectable } from '@nestjs/common';
import type { User, UserProfile } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: { profile: true },
    });
  }

  async findByWalletAddress(walletAddress: string) {
    return this.prisma.userProfile.findUnique({
      where: { walletAddress },
      include: { user: true },
    });
  }

  async getOrCreateUserByWallet(
    walletAddress: string,
  ): Promise<User & { profile: UserProfile | null }> {
    const cleanAddress = walletAddress.toLowerCase();

    const profile = await this.prisma.userProfile.findUnique({
      where: { walletAddress: cleanAddress },
      include: { user: true },
    });

    if (profile) {
      return {
        ...profile.user,
        profile,
      };
    }

    const shortAddr = `${cleanAddress.substring(0, 6)}...${cleanAddress.substring(cleanAddress.length - 4)}`;
    const username = `user_${cleanAddress.substring(2, 8)}_${Math.random().toString(36).substring(2, 6)}`;

    return this.prisma.user.create({
      data: {
        username,
        bio: `User account for wallet ${shortAddr}`,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanAddress}`,
        profile: {
          create: {
            walletAddress: cleanAddress,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async update(
    userId: string,
    data: { fullName?: string; website?: string; twitter?: string; github?: string },
  ) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }
}

import { Test, type TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { FavoriteRepository } from './repositories/favorite.repository';
import { ProfilesService } from '../profiles/profiles.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockFavoriteRepository = {
  add: jest.fn(),
  remove: jest.fn(),
  findManyByUser: jest.fn(),
  isFavorite: jest.fn(),
};

const mockProfilesService = {
  getOrCreateUserByWallet: jest.fn(),
};

const mockPrismaService = {
  aIModel: {
    findUnique: jest.fn(),
  },
};

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: FavoriteRepository, useValue: mockFavoriteRepository },
        { provide: ProfilesService, useValue: mockProfilesService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addFavorite', () => {
    it('adds favorite successfully when model exists', async () => {
      const dto = { modelId: 'm1', walletAddress: '0x123' };
      mockPrismaService.aIModel.findUnique.mockResolvedValue({ id: 'm1' });
      mockProfilesService.getOrCreateUserByWallet.mockResolvedValue({ id: 'u1' });
      mockFavoriteRepository.add.mockResolvedValue({ id: 'fav1', modelId: 'm1', userId: 'u1' });

      const result = await service.addFavorite(dto);
      expect(result).toBeDefined();
      expect(mockFavoriteRepository.add).toHaveBeenCalledWith('m1', 'u1');
    });

    it('throws NotFoundException when model does not exist', async () => {
      mockPrismaService.aIModel.findUnique.mockResolvedValue(null);
      await expect(service.addFavorite({ modelId: 'm1', walletAddress: '0x123' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeFavorite', () => {
    it('removes favorite successfully', async () => {
      mockProfilesService.getOrCreateUserByWallet.mockResolvedValue({ id: 'u1' });
      mockFavoriteRepository.remove.mockResolvedValue({ id: 'fav1' });

      const result = await service.removeFavorite('m1', '0x123');
      expect(result).toEqual({ success: true });
      expect(mockFavoriteRepository.remove).toHaveBeenCalledWith('m1', 'u1');
    });
  });
});

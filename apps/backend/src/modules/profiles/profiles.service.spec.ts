import { Test, type TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { ProfileRepository } from './repositories/profile.repository';
import { NotFoundException } from '@nestjs/common';

const mockProfileRepository = {
  findByUserId: jest.fn(),
  getOrCreateUserByWallet: jest.fn(),
  update: jest.fn(),
};

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: ProfileRepository,
          useValue: mockProfileRepository,
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfileByUserId', () => {
    it('returns user profile when user exists', async () => {
      const expectedUser = { id: 'u1', username: 'alice', profile: { fullName: 'Alice' } };
      mockProfileRepository.findByUserId.mockResolvedValue(expectedUser);

      const result = await service.getProfileByUserId('u1');
      expect(result).toEqual(expectedUser);
      expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith('u1');
    });

    it('throws NotFoundException when user does not exist', async () => {
      mockProfileRepository.findByUserId.mockResolvedValue(null);
      await expect(service.getProfileByUserId('u2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOrCreateUserByWallet', () => {
    it('calls repository getOrCreateUserByWallet', async () => {
      const expected = { id: 'u1', username: 'alice' };
      mockProfileRepository.getOrCreateUserByWallet.mockResolvedValue(expected);

      const result = await service.getOrCreateUserByWallet('0xabc');
      expect(result).toEqual(expected);
      expect(mockProfileRepository.getOrCreateUserByWallet).toHaveBeenCalledWith('0xabc');
    });
  });
});

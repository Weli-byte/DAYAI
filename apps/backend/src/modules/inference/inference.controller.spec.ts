import { Test, type TestingModule } from '@nestjs/testing';
import { InferenceStatus } from '@prisma/client';
import { InferenceController } from './inference.controller';
import { InferenceService } from './inference.service';

const mockInferenceService = {
  runInference: jest.fn(),
  getHistory: jest.fn(),
  getById: jest.fn(),
};

describe('InferenceController', () => {
  let controller: InferenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InferenceController],
      providers: [
        {
          provide: InferenceService,
          useValue: mockInferenceService,
        },
      ],
    }).compile();

    controller = module.get<InferenceController>(InferenceController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('runInference', () => {
    it('calls service.runInference', async () => {
      const dto = {
        modelId: 'model_1',
        prompt: 'Hello',
        walletAddress: '0x1234567890123456789012345678901234567890',
      };

      const expectedResult = {
        id: 'log_1',
        output: 'Hello Human',
        modelId: 'model_1',
        modelTitle: 'Test Model',
        tokensUsed: 5,
        inferenceTimeMs: 100,
        status: InferenceStatus.COMPLETED,
        createdAt: new Date(),
      };

      mockInferenceService.runInference.mockResolvedValue(expectedResult);

      const result = await controller.runInference(dto);

      expect(mockInferenceService.runInference).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getHistory', () => {
    it('calls service.getHistory', async () => {
      const query = {
        walletAddress: '0x1234567890123456789012345678901234567890',
        page: 1,
        limit: 10,
      };

      const expectedResult = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockInferenceService.getHistory.mockResolvedValue(expectedResult);

      const result = await controller.getHistory(query);

      expect(mockInferenceService.getHistory).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getById', () => {
    it('calls service.getById', async () => {
      const expectedResult = {
        id: 'log_1',
        output: 'Hello Human',
        modelId: 'model_1',
        modelTitle: 'Test Model',
        tokensUsed: 5,
        inferenceTimeMs: 100,
        status: InferenceStatus.COMPLETED,
        createdAt: new Date(),
      };

      mockInferenceService.getById.mockResolvedValue(expectedResult);

      const result = await controller.getById('log_1');

      expect(mockInferenceService.getById).toHaveBeenCalledWith('log_1');
      expect(result).toEqual(expectedResult);
    });
  });
});

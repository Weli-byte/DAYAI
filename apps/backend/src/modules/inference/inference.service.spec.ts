import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InferenceStatus } from '@prisma/client';
import { InferenceService } from './inference.service';

const mockPrisma = {
  aIModel: {
    findUnique: jest.fn(),
  },
};

const mockAiServiceClient = {
  runInference: jest.fn(),
};

const mockInferenceRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findManyByWallet: jest.fn(),
  updateStatus: jest.fn(),
};

function makeInferenceLog(overrides = {}) {
  return {
    id: 'log_1',
    modelId: 'model_1',
    walletAddress: '0x1234567890123456789012345678901234567890',
    prompt: 'Hello AI',
    output: 'Hello Human',
    status: InferenceStatus.COMPLETED,
    tokensUsed: 10,
    inferenceTimeMs: 200,
    errorMessage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    model: { title: 'Test Model' },
    ...overrides,
  };
}

describe('InferenceService', () => {
  let service: InferenceService;

  beforeEach(() => {
    service = new InferenceService(
      mockPrisma as any,
      mockAiServiceClient as any,
      mockInferenceRepository as any,
    );
    jest.clearAllMocks();
  });

  describe('runInference', () => {
    it('runs inference and saves output on success', async () => {
      const dto = {
        modelId: 'model_1',
        prompt: 'Hello AI',
        walletAddress: '0x1234567890123456789012345678901234567890',
        maxTokens: 50,
        temperature: 0.7,
      };

      mockPrisma.aIModel.findUnique.mockResolvedValue({ id: 'model_1' });
      mockInferenceRepository.create.mockResolvedValue(
        makeInferenceLog({ status: InferenceStatus.PENDING }),
      );
      mockAiServiceClient.runInference.mockResolvedValue({
        output: 'Hello Human',
        model_id: 'model_1',
        tokens_used: 10,
        inference_time_ms: 200.5,
      });
      mockInferenceRepository.updateStatus.mockResolvedValue(makeInferenceLog());

      const result = await service.runInference(dto);

      expect(mockPrisma.aIModel.findUnique).toHaveBeenCalledWith({
        where: { id: 'model_1', deletedAt: null },
      });
      expect(mockInferenceRepository.create).toHaveBeenCalledWith({
        modelId: 'model_1',
        walletAddress: dto.walletAddress,
        prompt: 'Hello AI',
      });
      expect(mockInferenceRepository.updateStatus).toHaveBeenCalledWith(
        'log_1',
        InferenceStatus.PROCESSING,
      );
      expect(mockAiServiceClient.runInference).toHaveBeenCalledWith('model_1', 'Hello AI', 50, 0.7);
      expect(mockInferenceRepository.updateStatus).toHaveBeenLastCalledWith(
        'log_1',
        InferenceStatus.COMPLETED,
        {
          output: 'Hello Human',
          tokensUsed: 10,
          inferenceTimeMs: 201,
        },
      );
      expect(result.output).toBe('Hello Human');
    });

    it('throws NotFoundException when model does not exist', async () => {
      mockPrisma.aIModel.findUnique.mockResolvedValue(null);

      await expect(
        service.runInference({
          modelId: 'missing_model',
          prompt: 'Hello',
          walletAddress: '0x1234567890123456789012345678901234567890',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('updates log to FAILED and rethrows on AI service failure', async () => {
      const dto = {
        modelId: 'model_1',
        prompt: 'Hello AI',
        walletAddress: '0x1234567890123456789012345678901234567890',
      };

      mockPrisma.aIModel.findUnique.mockResolvedValue({ id: 'model_1' });
      mockInferenceRepository.create.mockResolvedValue(
        makeInferenceLog({ status: InferenceStatus.PENDING }),
      );
      mockAiServiceClient.runInference.mockRejectedValue(new Error('AI service down'));
      mockInferenceRepository.updateStatus.mockResolvedValue(
        makeInferenceLog({ status: InferenceStatus.FAILED, errorMessage: 'AI service down' }),
      );

      await expect(service.runInference(dto)).rejects.toThrow(InternalServerErrorException);

      expect(mockInferenceRepository.updateStatus).toHaveBeenLastCalledWith(
        'log_1',
        InferenceStatus.FAILED,
        {
          errorMessage: 'AI service down',
        },
      );
    });
  });

  describe('getHistory', () => {
    it('returns paginated history list', async () => {
      const query = {
        walletAddress: '0x1234567890123456789012345678901234567890',
        page: 1,
        limit: 10,
      };

      mockInferenceRepository.findManyByWallet.mockResolvedValue({
        data: [makeInferenceLog()],
        total: 1,
        page: 1,
        limit: 10,
      });

      const result = await service.getHistory(query);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].modelTitle).toBe('Test Model');
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('getById', () => {
    it('returns detail when log exists', async () => {
      mockInferenceRepository.findById.mockResolvedValue(makeInferenceLog());

      const result = await service.getById('log_1');

      expect(result.id).toBe('log_1');
      expect(result.modelTitle).toBe('Test Model');
    });

    it('throws NotFoundException when log not found', async () => {
      mockInferenceRepository.findById.mockResolvedValue(null);

      await expect(service.getById('missing_log')).rejects.toThrow(NotFoundException);
    });
  });
});

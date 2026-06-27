import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { type ConfigService } from '@nestjs/config';

interface AIServiceInferenceResponse {
  output: string;
  model_id: string;
  tokens_used: number;
  inference_time_ms: number;
  timestamp: string;
}

@Injectable()
export class AiServiceClient {
  private readonly logger = new Logger(AiServiceClient.name);
  private readonly aiServiceUrl: string;
  private readonly timeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    this.aiServiceUrl =
      this.configService.get<string>('app.aiServiceUrl') ?? 'http://localhost:8000';
    this.timeoutMs = this.configService.get<number>('app.aiServiceTimeout') ?? 30000;
  }

  async runInference(
    modelId: string,
    prompt: string,
    maxTokens?: number,
    temperature?: number,
  ): Promise<AIServiceInferenceResponse> {
    const url = `${this.aiServiceUrl}/v1/inference`;
    const body = {
      model_id: modelId,
      prompt,
      max_tokens: maxTokens,
      temperature,
    };

    this.logger.log(`Sending inference request to AI Service: ${url} (model: ${modelId})`);

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`AI Service returned error status ${response.status}: ${errorText}`);

        if (response.status === 404) {
          throw new HttpException(
            `Model '${modelId}' not found in AI service`,
            HttpStatus.NOT_FOUND,
          );
        }

        throw new HttpException(
          `AI Service error: ${errorText || response.statusText}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      const result = (await response.json()) as AIServiceInferenceResponse;
      this.logger.log(`AI Service response received in ${result.inference_time_ms}ms`);
      return result;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      clearTimeout(id);

      if (error.name === 'AbortError') {
        this.logger.error(`AI Service request timed out after ${this.timeoutMs}ms`);
        throw new HttpException('AI Service request timed out', HttpStatus.GATEWAY_TIMEOUT);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Failed to connect to AI Service: ${error.message}`);
      throw new HttpException(
        `Failed to communicate with AI Service: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

/**
 * Models API — end-to-end test.
 *
 * Requires a real PostgreSQL database seeded with test data.
 * Set DATABASE_URL in your environment before running.
 *
 * Run: pnpm test:e2e
 */
import { Test, type TestingModule } from '@nestjs/testing';
import { type INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Models API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1', prefix: 'v' });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/models', () => {
    it('returns a paginated list', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/models').expect(200);

      // TransformInterceptor wraps the body in { success, data }
      const body = res.body?.data ?? res.body;
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('page');
      expect(Array.isArray(body.data)).toBe(true);
    });

    it('accepts search query parameter', async () => {
      await request(app.getHttpServer()).get('/api/v1/models?search=ResNet').expect(200);
    });

    it('accepts pagination parameters', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/models?page=1&limit=5')
        .expect(200);

      const body = res.body?.data ?? res.body;
      expect(body.limit).toBe(5);
    });
  });

  describe('POST /api/v1/models', () => {
    it('returns 400 when required fields are missing', async () => {
      await request(app.getHttpServer()).post('/api/v1/models').send({ title: '' }).expect(400);
    });
  });

  describe('GET /api/v1/categories', () => {
    it('returns an array of categories', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/categories').expect(200);
      const body = res.body?.data ?? res.body;
      expect(Array.isArray(body)).toBe(true);
    });
  });

  describe('GET /api/v1/tags', () => {
    it('returns an array of tags', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/tags').expect(200);
      const body = res.body?.data ?? res.body;
      expect(Array.isArray(body)).toBe(true);
    });
  });
});

import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

const logDir = process.env.LOG_DIR ?? 'logs';
const logLevel = process.env.LOG_LEVEL ?? 'debug';
const isProduction = process.env.NODE_ENV === 'production';

// Context matching helper
const filterByContext = (expectedContexts: string[]) => {
  return winston.format((info) => {
    const infoAny = info as any;
    const ctx = String(infoAny.context || infoAny.meta?.context || '').toLowerCase();
    const matches = expectedContexts.some((expected) => ctx.includes(expected.toLowerCase()));
    return matches ? info : false;
  })();
};

// Exclusion helper for general backend.log
const excludeContexts = (excludedContexts: string[]) => {
  return winston.format((info) => {
    const infoAny = info as any;
    const ctx = String(infoAny.context || infoAny.meta?.context || '').toLowerCase();
    const matches = excludedContexts.some((excluded) => ctx.includes(excluded.toLowerCase()));
    return matches ? false : info;
  })();
};

export const winstonConfig: winston.LoggerOptions = {
  level: logLevel,
  transports: [
    // Console — colorized in dev, JSON in prod
    new winston.transports.Console({
      format: isProduction
        ? winston.format.combine(winston.format.timestamp(), winston.format.json())
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Backend', {
              colors: true,
              prettyPrint: true,
            }),
          ),
    }),

    // 1. Error Logs (All errors across contexts)
    new winston.transports.File({
      filename: `${logDir}/error.log`,
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),

    // 2. AI Service & Inference Logs
    new winston.transports.File({
      filename: `${logDir}/ai-service.log`,
      format: winston.format.combine(
        filterByContext(['ai', 'inference', 'model_registry']),
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),

    // 3. Blockchain (Smart Contract, Minting) Logs
    new winston.transports.File({
      filename: `${logDir}/blockchain.log`,
      format: winston.format.combine(
        filterByContext(['blockchain', 'smartcontract', 'mint', 'contract']),
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),

    // 4. File Upload (IPFS, multer) Logs
    new winston.transports.File({
      filename: `${logDir}/upload.log`,
      format: winston.format.combine(
        filterByContext(['upload', 'ipfs', 'pinata', 'multer']),
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),

    // 5. API Requests & Routing Logs
    new winston.transports.File({
      filename: `${logDir}/api.log`,
      format: winston.format.combine(
        filterByContext(['http', 'request', 'router', 'requestid', 'api']),
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxsize: 20 * 1024 * 1024,
      maxFiles: 5,
    }),

    // 6. General Backend Logs (Excludes specific modules for clarity)
    new winston.transports.File({
      filename: `${logDir}/backend.log`,
      format: winston.format.combine(
        excludeContexts([
          'ai',
          'inference',
          'blockchain',
          'smartcontract',
          'upload',
          'ipfs',
          'http',
          'request',
          'router',
        ]),
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxsize: 20 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
};

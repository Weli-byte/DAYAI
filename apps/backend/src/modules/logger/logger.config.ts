import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

const logDir = process.env.LOG_DIR ?? 'logs';
const logLevel = process.env.LOG_LEVEL ?? 'debug';
const isProduction = process.env.NODE_ENV === 'production';

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

    // File transports — always JSON for machine parsing
    new winston.transports.File({
      filename: `${logDir}/error.log`,
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: `${logDir}/combined.log`,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      maxsize: 50 * 1024 * 1024, // 50 MB
      maxFiles: 10,
    }),
  ],
};

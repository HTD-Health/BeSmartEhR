import { NextFunction, Request, Response } from 'express';
import winston from 'winston';
import config from '../config';

const iconFormat = winston.format((info) => {
  if (info.isRequest) {
    info.message = `🚀 ${info.message}`;
  } else if (info.isResponse) {
    info.message = `✅ ${info.message}`;
  } else if (info.isError) {
    info.message = `❌ ${info.message}`;
  } else if (info.level === 'warn') {
    info.message = `⚠️ ${info.message}`;
  } else if (info.level === 'info') {
    info.message = `ℹ️ ${info.message}`;
  } else if (info.level === 'debug') {
    info.message = `🐞 ${info.message}`;
  }

  return info;
});

export const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    iconFormat(),
    winston.format.json()
  ),
  defaultMeta: { service: config.serviceName },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    isRequest: true,
  });
  logger.info('Request body & headers', {
    body: req.body,
    headers: req.headers,
    isRequest: true,
  });

  res.on('finish', () => {
    logger.info('Response sent', {
      statusCode: res.statusCode,
      isResponse: true,
    });
  });

  next();
};

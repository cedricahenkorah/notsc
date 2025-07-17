import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      silent: isProduction,
    }),
    ...(isProduction
      ? [
        new DailyRotateFile({
          filename: 'logs/%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ]
      : []),
  ],
});

export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

import Config from '@/config';
import winston from 'winston';
export * from './utils';

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(f => `${f.timestamp} [${f.level}] ${f.message}`);

let winstonConfig: winston.LoggerOptions = {};

const consoleTransport = new winston.transports.Console({
  format: combine(colorize(), timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }), customFormat),
});
const infoFileTransport = new winston.transports.File({
  filename: 'logs/combined.log',
  format: combine(timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }), customFormat),
});
const errorFileTransport = new winston.transports.File({
  filename: 'logs/errors.log',
  level: 'error',
  format: combine(timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }), customFormat),
});

if (Config.NODE_ENV === 'production') {
  winstonConfig.level = 'info';
  winstonConfig.transports = [infoFileTransport, errorFileTransport];
} else {
  winstonConfig.level = 'debug';
  winstonConfig.transports = [consoleTransport];
}

const log = winston.createLogger(winstonConfig);

global.log = log;

// Typescript
declare global {
  var log: winston.Logger;
}

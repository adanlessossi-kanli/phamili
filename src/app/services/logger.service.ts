import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private logLevel = environment.production ? LogLevel.ERROR : LogLevel.DEBUG;

  error(message: string, ...args: any[]) {
    this.log(LogLevel.ERROR, message, args);
  }

  warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, args);
  }

  info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, args);
  }

  debug(message: string, ...args: any[]) {
    this.log(LogLevel.DEBUG, message, args);
  }

  private log(level: LogLevel, message: string, args: any[]) {
    if (level <= this.logLevel) {
      const timestamp = new Date().toISOString();
      const levelName = LogLevel[level];
      const logMessage = `[${timestamp}] ${levelName}: ${message}`;

      switch (level) {
        case LogLevel.ERROR:
          console.error(logMessage, ...args);
          this.sendToServer('error', logMessage, args);
          break;
        case LogLevel.WARN:
          console.warn(logMessage, ...args);
          break;
        case LogLevel.INFO:
          console.info(logMessage, ...args);
          break;
        case LogLevel.DEBUG:
          console.debug(logMessage, ...args);
          break;
      }
    }
  }

  private sendToServer(level: string, message: string, args: any[]) {
    if (environment.production) {
      // Send critical logs to monitoring service
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, message, args, timestamp: Date.now() })
      }).catch(() => {}); // Silent fail
    }
  }
}
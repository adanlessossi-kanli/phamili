import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
    spyOn(console, 'error');
    spyOn(console, 'warn');
    spyOn(console, 'info');
    spyOn(console, 'debug');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log error messages', () => {
    service.error('Test error');
    expect(console.error).toHaveBeenCalled();
  });

  it('should log warn messages', () => {
    service.warn('Test warning');
    expect(console.warn).toHaveBeenCalled();
  });

  it('should log info messages', () => {
    service.info('Test info');
    expect(console.info).toHaveBeenCalled();
  });

  it('should log debug messages', () => {
    service.debug('Test debug');
    expect(console.debug).toHaveBeenCalled();
  });
});
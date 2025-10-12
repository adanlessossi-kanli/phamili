import { TestBed } from '@angular/core/testing';
import { PwaService } from './pwa.service';

describe('PwaService', () => {
  let service: PwaService;
  let mockPrompt: jasmine.SpyObj<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaService);
    
    mockPrompt = jasmine.createSpyObj('BeforeInstallPromptEvent', ['prompt', 'preventDefault']);
    mockPrompt.userChoice = Promise.resolve({ outcome: 'accepted' });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle beforeinstallprompt event', () => {
    const event = new Event('beforeinstallprompt');
    Object.assign(event, mockPrompt);
    
    window.dispatchEvent(event);
    
    expect(service.canInstall()).toBe(true);
  });

  it('should install app successfully', async () => {
    service['deferredPrompt'].set(mockPrompt);
    service.canInstall.set(true);
    
    const result = await service.installApp();
    
    expect(result).toBe(true);
    expect(mockPrompt.prompt).toHaveBeenCalled();
    expect(service.canInstall()).toBe(false);
  });

  it('should return false when no prompt available', async () => {
    service['deferredPrompt'].set(null);
    
    const result = await service.installApp();
    
    expect(result).toBe(false);
  });

  it('should handle user rejection', async () => {
    mockPrompt.userChoice = Promise.resolve({ outcome: 'dismissed' });
    service['deferredPrompt'].set(mockPrompt);
    
    const result = await service.installApp();
    
    expect(result).toBe(false);
  });
});
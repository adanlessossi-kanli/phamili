import { TestHelpers } from './test-helpers';

describe('TestHelpers', () => {
  it('should create mock signal', () => {
    const signal = TestHelpers.createMockSignal('test');
    expect(signal()).toBe('test');
  });

  it('should create mock auth service', () => {
    const authService = TestHelpers.createMockAuthService(true, { id: '1', name: 'Test' });
    expect(authService.isAuthenticated$()).toBe(true);
    expect(authService.user$()).toEqual({ id: '1', name: 'Test' });
  });

  it('should create mock notification service', () => {
    const service = TestHelpers.createMockNotificationService();
    expect(service.success).toBeDefined();
    expect(service.error).toBeDefined();
  });

  it('should create mock router', () => {
    const router = TestHelpers.createMockRouter();
    expect(router.navigate).toBeDefined();
  });

  it('should create mock data service', () => {
    const service = TestHelpers.createMockDataService();
    expect(service.theme()).toBe('light');
  });

  it('should create mock PWA service', () => {
    const service = TestHelpers.createMockPwaService(true);
    expect(service.canInstall()).toBe(true);
  });

  it('should create mock state service', () => {
    const service = TestHelpers.createMockStateService();
    expect(service.user()).toBeNull();
    expect(service.theme()).toBe('light');
  });
});
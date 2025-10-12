import { TestBed } from '@angular/core/testing';
import { ExportService } from './export.service';

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should export to CSV', () => {
    const data = [{ name: 'Test', value: 123 }];
    spyOn(service as any, 'downloadFile');
    service.exportToCSV(data, 'test');
    expect((service as any).downloadFile).toHaveBeenCalled();
  });

  it('should export to JSON', () => {
    const data = [{ name: 'Test', value: 123 }];
    spyOn(service as any, 'downloadFile');
    service.exportToJSON(data, 'test');
    expect((service as any).downloadFile).toHaveBeenCalled();
  });

  it('should export blog posts', () => {
    const posts = [{ title: 'Test', date: '2024-01-01', excerpt: 'Test' }];
    spyOn(service, 'exportToCSV');
    service.exportBlogPosts(posts);
    expect(service.exportToCSV).toHaveBeenCalled();
  });

  it('should export media items', () => {
    const items = [{ title: 'Test', type: 'image', category: 'photo' }];
    spyOn(service, 'exportToJSON');
    service.exportMediaItems(items);
    expect(service.exportToJSON).toHaveBeenCalled();
  });

  it('should export to PDF', () => {
    const content = '<h1>Test Content</h1>';
    spyOn(service as any, 'downloadFile');
    service.exportToPDF(content, 'test');
    expect((service as any).downloadFile).not.toHaveBeenCalled(); // PDF uses different method
  });

  it('should export to Excel', () => {
    const data = [{ name: 'Test', value: 123 }];
    spyOn(service as any, 'downloadFile');
    service.exportToExcel(data, 'test');
    expect((service as any).downloadFile).toHaveBeenCalled();
  });

  it('should handle empty data arrays', () => {
    spyOn(service as any, 'downloadFile');
    service.exportToCSV([], 'empty'); // Returns early, no call
    service.exportToJSON([], 'empty'); // Makes one call
    expect((service as any).downloadFile).toHaveBeenCalledTimes(1);
  });

  it('should handle complex nested objects', () => {
    const data = [{ nested: { deep: { value: 1 } }, array: [1, 2, 3] }];
    spyOn(service as any, 'downloadFile');
    service.exportToJSON(data, 'complex');
    expect((service as any).downloadFile).toHaveBeenCalled();
  });

  it('should handle CSV with missing properties', () => {
    const data = [{ name: 'Test', value: null }];
    spyOn(service as any, 'downloadFile');
    service.exportToCSV(data, 'test');
    expect((service as any).downloadFile).toHaveBeenCalled();
  });

  it('should call downloadFile directly', () => {
    // Mock DOM elements and methods
    const mockLink = {
      href: '',
      download: '',
      click: jasmine.createSpy('click')
    };
    spyOn(document, 'createElement').and.returnValue(mockLink as any);
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');
    spyOn(URL, 'createObjectURL').and.returnValue('mock-url');
    spyOn(URL, 'revokeObjectURL');
    
    service['downloadFile']('content', 'test.txt', 'text/plain');
    
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.click).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
});
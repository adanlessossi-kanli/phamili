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
});
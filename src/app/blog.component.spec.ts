import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BlogComponent } from './blog.component';
import { DataService } from './data.service';
import { NotificationService } from './notification.service';

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;
  let dataService: jasmine.SpyObj<DataService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const dataSpy = jasmine.createSpyObj('DataService', ['getBlogPosts']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['info', 'success']);
    dataSpy.getBlogPosts.and.returnValue({
      posts: [{ id: 1, title: 'Test', date: '2024-01-01', excerpt: 'Test excerpt' }],
      total: 1,
      hasMore: false
    });

    await TestBed.configureTestingModule({
      imports: [BlogComponent],
      providers: [
        { provide: DataService, useValue: dataSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts on init', fakeAsync(() => {
    component.ngOnInit();
    tick(800);
    expect(component.posts().length).toBe(1);
    expect(component.loading()).toBe(false);
  }));

  it('should handle next page', () => {
    component.hasMore.set(true);
    component.nextPage();
    expect(component.currentPage()).toBe(2);
  });

  it('should load more posts', () => {
    component.hasMore.set(true);
    component.loadMore();
    expect(notificationService.success).toHaveBeenCalled();
  });

  it('should handle previous page', () => {
    component.currentPage.set(2);
    component.prevPage();
    expect(component.currentPage()).toBe(1);
  });

  it('should select post', () => {
    const post = { id: 1, title: 'Test' };
    component.selectPost(post);
    expect(notificationService.info).toHaveBeenCalledWith('Opening: Test');
  });
});
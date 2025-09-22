import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { NotificationService } from './notification.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display notifications', () => {
    notificationService.show('Test message', 'success');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.toast')).toBeTruthy();
    expect(compiled.querySelector('.toast-message').textContent).toContain('Test message');
  });

  it('should get correct icon for notification type', () => {
    expect(component.getIcon('success')).toBe('✓');
    expect(component.getIcon('error')).toBe('✗');
    expect(component.getIcon('warning')).toBe('⚠');
    expect(component.getIcon('info')).toBe('ℹ');
    expect(component.getIcon('unknown')).toBe('ℹ');
  });

  it('should remove notification on click', () => {
    const id = notificationService.show('Test message', 'success');
    fixture.detectChanges();
    
    const toastElement = fixture.nativeElement.querySelector('.toast');
    toastElement.click();
    
    expect(notificationService.notifications$().length).toBe(0);
  });
});
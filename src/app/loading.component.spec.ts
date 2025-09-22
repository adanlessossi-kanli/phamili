import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render skeleton items', () => {
    const compiled = fixture.nativeElement;
    const skeletonItems = compiled.querySelectorAll('.skeleton-item');
    expect(skeletonItems.length).toBe(3);
  });

  it('should have skeleton animations', () => {
    const compiled = fixture.nativeElement;
    const skeletonAvatar = compiled.querySelector('.skeleton-avatar');
    expect(skeletonAvatar).toBeTruthy();
    expect(skeletonAvatar).toBeTruthy();
  });
});
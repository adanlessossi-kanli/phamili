import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    component.currentPage = 2;
    component.totalPages = 5;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit page change', () => {
    spyOn(component.pageChange, 'emit');
    component.onPageChange(3);
    expect(component.pageChange.emit).toHaveBeenCalledWith(3);
  });

  it('should not emit same page', () => {
    spyOn(component.pageChange, 'emit');
    component.onPageChange(2);
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should calculate visible pages', () => {
    const pages = component.visiblePages();
    expect(pages).toContain(2);
    expect(pages.length).toBeLessThanOrEqual(5);
  });

  it('should handle edge cases', () => {
    spyOn(component.pageChange, 'emit');
    component.onPageChange(0);
    component.onPageChange(10);
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });
});
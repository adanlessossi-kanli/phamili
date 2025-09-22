import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaComponent } from './media.component';
import { DataService } from './data.service';

describe('MediaComponent', () => {
  let component: MediaComponent;
  let fixture: ComponentFixture<MediaComponent>;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DataService', ['getMediaItems']);
    spy.getMediaItems.and.returnValue([
      { id: 1, title: 'Test', type: '🖼️', category: 'photo' }
    ]);

    await TestBed.configureTestingModule({
      imports: [MediaComponent],
      providers: [{ provide: DataService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(MediaComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter items', () => {
    component.setFilter('photo');
    expect(component.selectedFilter()).toBe('photo');
    expect(component.filteredItems().length).toBe(1);
  });

  it('should show all items when filter is all', () => {
    component.setFilter('all');
    expect(component.filteredItems().length).toBe(1);
  });

  it('should open lightbox', () => {
    const item = { id: 1, title: 'Test' };
    component.openLightbox(item);
    expect(component.selectedItem()).toBe(item);
  });

  it('should close lightbox', () => {
    component.selectedItem.set({ id: 1 });
    component.closeLightbox();
    expect(component.selectedItem()).toBeNull();
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { DataService } from './data.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DataService', ['toggleTheme'], {
      theme: jasmine.createSpy().and.returnValue('light')
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: DataService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme', () => {
    component.toggleTheme();
    expect(dataService.toggleTheme).toHaveBeenCalled();
  });

  it('should handle search', () => {
    spyOn(console, 'log');
    const event = { target: { value: 'test' } };
    component.onSearch(event);
    expect(console.log).toHaveBeenCalledWith('Search:', 'test');
  });
});
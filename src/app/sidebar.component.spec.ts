import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';
import { I18nService } from './i18n.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    const i18nSpy = jasmine.createSpyObj('I18nService', ['translate']);
    i18nSpy.translate.and.callFake((key: string) => {
      const translations: { [key: string]: string } = {
        'nav.home': 'Home',
        'nav.blog': 'Blog',
        'nav.media': 'Media',
        'nav.about': 'About'
      };
      return translations[key] || key;
    });

    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule],
      providers: [
        { provide: I18nService, useValue: i18nSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have menu items', () => {
    expect(component.menuItems.length).toBe(4);
    expect(component.menuItems[0].labelKey).toBe('nav.home');
    expect(component.menuItems[0].route).toBe('/home');
  });

  it('should toggle sidebar', () => {
    expect(component.isCollapsed).toBe(false);
    component.toggleSidebar();
    expect(component.isCollapsed).toBe(true);
  });

  it('should render menu items', () => {
    const compiled = fixture.nativeElement;
    const navItems = compiled.querySelectorAll('.nav-item');
    expect(navItems.length).toBe(4);
  });

  it('should use i18n translations for labels', () => {
    const i18nService = TestBed.inject(I18nService) as jasmine.SpyObj<I18nService>;
    fixture.detectChanges();
    expect(i18nService.translate).toHaveBeenCalledWith('nav.home');
    expect(i18nService.translate).toHaveBeenCalledWith('nav.blog');
    expect(i18nService.translate).toHaveBeenCalledWith('nav.media');
    expect(i18nService.translate).toHaveBeenCalledWith('nav.about');
  });

  it('should have proper icons for menu items', () => {
    expect(component.menuItems[0].icon).toBe('🏠');
    expect(component.menuItems[1].icon).toBe('📝');
    expect(component.menuItems[2].icon).toBe('🎬');
    expect(component.menuItems[3].icon).toBe('ℹ️');
  });

  it('should render sidebar header', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('.sidebar-header');
    expect(header).toBeTruthy();
  });

  it('should render toggle button', () => {
    const compiled = fixture.nativeElement;
    const toggleBtn = compiled.querySelector('.toggle-btn');
    expect(toggleBtn).toBeTruthy();
  });

  it('should handle toggle button click', () => {
    spyOn(component, 'toggleSidebar');
    const compiled = fixture.nativeElement;
    const toggleBtn = compiled.querySelector('.toggle-btn');
    toggleBtn.click();
    expect(component.toggleSidebar).toHaveBeenCalled();
  });

  it('should apply collapsed class when collapsed', () => {
    component.isCollapsed = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const sidebar = compiled.querySelector('.sidebar');
    expect(sidebar.classList.contains('collapsed')).toBeTruthy();
  });

  it('should hide labels when collapsed', () => {
    component.isCollapsed = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const labels = compiled.querySelectorAll('.label');
    // When collapsed, labels should not be visible (they have *ngIf="!isCollapsed")
    expect(labels.length).toBe(0);
  });

  it('should show labels when not collapsed', () => {
    component.isCollapsed = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const labels = compiled.querySelectorAll('.label');
    expect(labels.length).toBe(4);
  });
});
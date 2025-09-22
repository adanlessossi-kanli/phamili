import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial form state', () => {
    expect(component.form.name).toBe('');
    expect(component.form.email).toBe('');
    expect(component.form.message).toBe('');
  });

  it('should submit form', () => {
    spyOn(console, 'log');
    spyOn(window, 'alert');
    
    component.form = { name: 'Test', email: 'test@test.com', message: 'Hello' };
    component.submitForm();
    
    expect(console.log).toHaveBeenCalledWith('Form submitted:', jasmine.any(Object));
    expect(window.alert).toHaveBeenCalled();
    expect(component.form.name).toBe('');
  });

  it('should render features grid', () => {
    const compiled = fixture.nativeElement;
    const features = compiled.querySelectorAll('.feature');
    expect(features.length).toBe(4);
  });

  it('should render contact form', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.contact-form')).toBeTruthy();
    expect(compiled.querySelectorAll('input').length).toBe(2);
    expect(compiled.querySelector('textarea')).toBeTruthy();
  });
});
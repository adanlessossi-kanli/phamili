import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>About Phamili</h1>
        <div class="breadcrumb">Home > About</div>
      </div>
      <div class="content">
        <div class="about-section">
          <p>Phamili is a modern web application built with Angular, designed to provide a seamless user experience with cutting-edge technology.</p>
          <h3>Features</h3>
          <div class="features-grid">
            <div class="feature">
              <div class="icon">🎨</div>
              <h4>Modern Design</h4>
              <p>Clean, responsive interface with dark/light themes</p>
            </div>
            <div class="feature">
              <div class="icon">⚡</div>
              <h4>Fast Performance</h4>
              <p>Optimized loading with lazy routes and signals</p>
            </div>
            <div class="feature">
              <div class="icon">📱</div>
              <h4>Mobile Ready</h4>
              <p>Fully responsive across all device sizes</p>
            </div>
            <div class="feature">
              <div class="icon">🔒</div>
              <h4>Accessible</h4>
              <p>Built with accessibility and SEO in mind</p>
            </div>
          </div>
        </div>
        <div class="contact-section">
          <h3>Get In Touch</h3>
          <form class="contact-form" (ngSubmit)="submitForm()">
            <input [(ngModel)]="form.name" name="name" placeholder="Your Name" required>
            <input [(ngModel)]="form.email" name="email" type="email" placeholder="Your Email" required>
            <textarea [(ngModel)]="form.message" name="message" placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
        <div class="social-links">
          <h3>Follow Us</h3>
          <div class="social-icons">
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="LinkedIn">💼</a>
            <a href="#" aria-label="GitHub">💻</a>
            <a href="#" aria-label="Email">✉️</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 20px; }
    .page-header { margin-bottom: 30px; }
    h1 { color: #2c3e50; margin-bottom: 10px; }
    .breadcrumb { color: #95a5a6; font-size: 0.9rem; }
    .content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .about-section { margin-bottom: 40px; }
    h3 { color: #2c3e50; margin: 25px 0 15px 0; }
    p { color: #7f8c8d; line-height: 1.6; margin-bottom: 20px; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .feature { text-align: center; padding: 20px; border: 1px solid #ecf0f1; border-radius: 8px; }
    .feature .icon { font-size: 2rem; margin-bottom: 10px; }
    .feature h4 { color: #2c3e50; margin-bottom: 10px; }
    .feature p { color: #7f8c8d; font-size: 0.9rem; }
    .contact-form { display: flex; flex-direction: column; gap: 15px; max-width: 400px; }
    .contact-form input, .contact-form textarea { padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; }
    .contact-form textarea { min-height: 100px; resize: vertical; }
    .contact-form button { padding: 12px; background: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer; transition: background 0.3s; }
    .contact-form button:hover { background: #34495e; }
    .social-icons { display: flex; gap: 15px; }
    .social-icons a { font-size: 1.5rem; text-decoration: none; transition: transform 0.3s; }
    .social-icons a:hover { transform: scale(1.2); }
  `]
})
export class AboutComponent {
  form = {
    name: '',
    email: '',
    message: ''
  };

  submitForm() {
    console.log('Form submitted:', this.form);
    alert('Thank you for your message! We\'ll get back to you soon.');
    this.form = { name: '', email: '', message: '' };
  }
}
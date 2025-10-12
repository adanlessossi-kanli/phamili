import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-amplify-ui',
  standalone: true,
  template: `
    <div class="redirect-container">
      <h2>Redirecting to Login...</h2>
      <p>Please use the main login page for authentication.</p>
    </div>
  `,
  styles: [`
    .redirect-container {
      padding: 40px;
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }
  `]
})
export class AmplifyUIComponent implements OnInit {
  private router = inject(Router);

  ngOnInit() {
    this.router.navigate(['/login']);
  }
}
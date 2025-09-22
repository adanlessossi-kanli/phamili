import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="not-found">
      <div class="content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <a routerLink="/home" class="home-btn">Go Home</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
    }
    .content h1 {
      font-size: 6rem;
      color: #2c3e50;
      margin: 0;
    }
    .content h2 {
      color: #2c3e50;
      margin: 20px 0;
    }
    .content p {
      color: #7f8c8d;
      margin-bottom: 30px;
    }
    .home-btn {
      display: inline-block;
      padding: 12px 24px;
      background: #2c3e50;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.3s;
    }
    .home-btn:hover {
      background: #34495e;
    }
  `]
})
export class NotFoundComponent {}
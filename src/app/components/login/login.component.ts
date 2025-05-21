import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo">
          <mat-icon>account_circle</mat-icon>
        </div>
        <h1>Welcome Back</h1>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" placeholder="Enter your username">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" placeholder="Enter your password">
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="!loginForm.valid">
            Log In
          </button>

          <a class="forgot-password" routerLink="/forgot-password">Forgot Password?</a>
          
          <div class="signup-prompt">
            Don't have an account? <a routerLink="/signup">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
    }

    .login-card {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    h1 {
      margin-bottom: 2rem;
      color: #333;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    button {
      margin-top: 1rem;
      padding: 0.75rem;
    }

    .forgot-password {
      display: block;
      margin-top: 1rem;
      color: #666;
      text-decoration: none;
    }

    .signup-prompt {
      margin-top: 2rem;
      color: #666;
      a {
        color: #1976d2;
        text-decoration: none;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // In a real app, you would call an authentication service here
      this.router.navigate(['/overview']);
    }
  }
}
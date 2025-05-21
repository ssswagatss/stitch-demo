import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private supabaseService: SupabaseService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit(): void {
        // Check if user is already logged in
        this.supabaseService.user$.subscribe(user => {
            if (user) {
                this.router.navigate(['/overview']);
            }
        });
    }

    async onSubmit(): Promise<void> {
        if (this.loginForm.valid) {
            try {
                this.loading = true;
                this.error = null;
                const { email, password } = this.loginForm.value;
                await this.supabaseService.signIn(email, password);
                this.router.navigate(['/overview']);
            } catch (error: any) {
                this.error = error.message || 'An error occurred during sign in';
            } finally {
                this.loading = false;
            }
        }
    }
} 
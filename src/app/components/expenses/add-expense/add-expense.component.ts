import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseCategory } from '../../../models/expense.model';
import { SupabaseService } from '../../../services/supabase.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-add-expense',
    templateUrl: './add-expense.component.html',
    styleUrls: ['./add-expense.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class AddExpenseComponent implements OnInit {
    expenseForm: FormGroup;
    categories = Object.values(ExpenseCategory);
    loading = false;
    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private supabaseService: SupabaseService
    ) {
        this.expenseForm = this.fb.group({
            amount: ['', [Validators.required, Validators.min(0.01)]],
            category: ['', [Validators.required]],
            date: ['', [Validators.required]],
            description: [''],
            merchant: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        // Set default date to today
        this.expenseForm.patchValue({
            date: new Date().toISOString().split('T')[0]
        });
    }

    async onSubmit(): Promise<void> {
        if (this.expenseForm.valid) {
            try {
                this.loading = true;
                this.error = null;

                const formValue = this.expenseForm.value;
                const userId = (await this.supabaseService.user$.pipe(take(1)).toPromise())?.id;

                if (!userId) {
                    throw new Error('User not authenticated');
                }

                await this.supabaseService.addExpense({
                    amount: formValue.amount,
                    category: formValue.category,
                    date: new Date(formValue.date),
                    description: formValue.description,
                    merchant: formValue.merchant,
                    userId: userId
                });

                this.router.navigate(['/overview']);
            } catch (error: any) {
                this.error = error.message || 'An error occurred while adding the expense';
            } finally {
                this.loading = false;
            }
        }
    }

    onCancel(): void {
        this.router.navigate(['/overview']);
    }
} 
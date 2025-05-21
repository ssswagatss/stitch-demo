import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  template: `
    <div class="add-expense-container">
      <div class="form-card">
        <h1>Add Expense</h1>
        
        <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Amount</mat-label>
            <input matInput type="number" formControlName="amount" placeholder="Enter amount">
            <span matPrefix>$&nbsp;</span>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category">
              <mat-option value="Coffee">Coffee</mat-option>
              <mat-option value="Lunch">Lunch</mat-option>
              <mat-option value="Groceries">Groceries</mat-option>
              <mat-option value="Gas">Gas</mat-option>
              <mat-option value="Movie">Movie</mat-option>
              <mat-option value="Salary">Salary</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <input matInput formControlName="description" placeholder="Enter description">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="expense">Expense</mat-option>
              <mat-option value="income">Income</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="onCancel()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="!expenseForm.valid">
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .add-expense-container {
      padding: 1rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .form-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h1 {
      margin-bottom: 2rem;
      color: #333;
      text-align: center;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
  `]
})
export class AddExpenseComponent {
  expenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private transactionService: TransactionService
  ) {
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      date: [new Date(), Validators.required],
      description: [''],
      type: ['expense', Validators.required]
    });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const formValue = this.expenseForm.value;
      this.transactionService.addTransaction({
        amount: formValue.amount,
        category: formValue.category,
        date: formValue.date,
        description: formValue.description,
        merchant: formValue.description, // Using description as merchant name for simplicity
        type: formValue.type
      });
      this.router.navigate(['/expenses']);
    }
  }

  onCancel() {
    this.router.navigate(['/expenses']);
  }
}
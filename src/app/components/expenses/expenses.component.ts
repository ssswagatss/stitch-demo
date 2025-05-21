import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe, DecimalPipe, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { Expense } from '../../models/expense.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ExpenseGroup {
  date: Date;
  total: number;
  expenses: Expense[];
}

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    NgFor,
    CommonModule ,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterLink
  ],
  template: `
    <div class="expenses-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Expenses</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="expenses-list">
            <div class="day-group" *ngFor="let group of expenseGroups$ | async">
              <div class="day-header">
                <span class="date">{{ group.date | date:'mediumDate' }}</span>
                <span class="total">Total: {{ group.total | number:'1.2-2' }}</span>
              </div>
              
              <mat-list>
                <mat-list-item *ngFor="let expense of group.expenses">
                  <div class="expense-item">
                    <div class="expense-icon">
                      <mat-icon>{{ getIconForCategory(expense.category) }}</mat-icon>
                    </div>
                    <div class="expense-details">
                      <span class="merchant">{{ expense.merchant }}</span>
                      <span class="category">{{ expense.category }}</span>
                    </div>
                    <div class="expense-amount">
                      -{{ expense.amount | number:'1.2-2' }}
                    </div>
                  </div>
                </mat-list-item>
              </mat-list>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <button mat-fab color="primary" class="add-button" routerLink="/add-expense">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .expenses-container {
      padding: 1rem;
      max-width: 800px;
      margin: 0 auto;
      position: relative;
    }

    .day-group {
      margin-bottom: 1.5rem;
    }

    .day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
      margin-bottom: 0.5rem;

      .date {
        font-weight: 500;
        color: #333;
      }

      .total {
        color: #666;
      }
    }

    .expense-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      padding: 0.5rem 0;
    }

    .expense-icon {
      mat-icon {
        color: #f44336;
      }
    }

    .expense-details {
      flex: 1;
      display: flex;
      flex-direction: column;

      .merchant {
        font-weight: 500;
      }

      .category {
        font-size: 0.9rem;
        color: #666;
      }
    }

    .expense-amount {
      font-weight: 500;
      color: #f44336;
    }

    .add-button {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
    }
  `]
})
export class ExpensesComponent implements OnInit {
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenseGroups$: Observable<ExpenseGroup[]>;

  constructor(private supabaseService: SupabaseService) {
    this.expenseGroups$ = this.expensesSubject.pipe(
      map(expenses => this.groupExpensesByDate(expenses))
    );
  }

  ngOnInit() {
    this.loadExpenses();
  }

  private async loadExpenses() {
    try {
      const user = await this.supabaseService.getCurrentUser();
      if (user) {
        const expenses = await this.supabaseService.getExpenses(user.id);
        this.expensesSubject.next(expenses);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  }

  private groupExpensesByDate(expenses: Expense[]): ExpenseGroup[] {
    const groups = new Map<string, ExpenseGroup>();

    expenses.forEach(expense => {
      const dateStr = new Date(expense.date).toDateString();
      if (!groups.has(dateStr)) {
        groups.set(dateStr, {
          date: new Date(expense.date),
          total: 0,
          expenses: []
        });
      }
      const group = groups.get(dateStr)!;
      group.expenses.push(expense);
      group.total += expense.amount;
    });

    return Array.from(groups.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getIconForCategory(category: string): string {
    const iconMap: { [key: string]: string } = {
      'Food': 'restaurant',
      'Groceries': 'shopping_cart',
      'Transportation': 'directions_car',
      'Entertainment': 'movie',
      'Utilities': 'power',
      'Shopping': 'shopping_bag',
      'Health': 'local_hospital',
      'Travel': 'flight',
      'Education': 'school',
      'Other': 'receipt_long'
    };

    return iconMap[category] || 'receipt_long';
  }
}
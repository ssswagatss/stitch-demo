import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { Expense } from '../../models/expense.model';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class OverviewComponent implements OnInit {
  user: User | null = null;
  recentTransactions: Expense[] = [];
  loading = true;
  error: string | null = null;

  constructor(private supabaseService: SupabaseService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData() {
    try {
      // Subscribe to user changes
      this.supabaseService.user$.subscribe(async (user) => {
        this.user = user;
        if (user) {
          // Load transactions
          this.recentTransactions = await this.supabaseService.getExpenses(user.id);
        }
        this.loading = false;
      });
    } catch (error: any) {
      this.error = error.message;
      this.loading = false;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  async onSignOut() {
    try {
      await this.supabaseService.signOut();
    } catch (error: any) {
      this.error = error.message;
    }
  }
}
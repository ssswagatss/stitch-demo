import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { AddExpenseComponent } from './components/expenses/add-expense/add-expense.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'overview',
    component: OverviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'expenses',
    component: ExpensesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-expense',
    component: AddExpenseComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/overview' }
];

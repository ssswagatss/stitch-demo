import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction, User } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private mockUser: User = {
    id: '1',
    name: 'Ethan Carter',
    balance: 12345.67,
    avatar: 'assets/avatar.png'
  };

  private mockTransactions: Transaction[] = [
    {
      id: '1',
      amount: 3.50,
      category: 'Coffee',
      description: 'Starbucks',
      date: new Date(),
      merchant: 'Starbucks',
      type: 'expense'
    },
    {
      id: '2',
      amount: 12.75,
      category: 'Lunch',
      description: 'The Italian Place',
      date: new Date(),
      merchant: 'The Italian Place',
      type: 'expense'
    },
    {
      id: '3',
      amount: 45.20,
      category: 'Groceries',
      description: 'Local Supermarket',
      date: new Date(),
      merchant: 'Local Supermarket',
      type: 'expense'
    },
    {
      id: '4',
      amount: 3000,
      category: 'Salary',
      description: 'Monthly Salary',
      date: new Date(),
      merchant: 'Tech Solutions Inc.',
      type: 'income'
    }
  ];

  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.mockTransactions);
  private userSubject = new BehaviorSubject<User>(this.mockUser);

  getTransactions(): Observable<Transaction[]> {
    return this.transactionsSubject.asObservable();
  }

  getUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9)
    };
    const currentTransactions = this.transactionsSubject.value;
    this.transactionsSubject.next([newTransaction, ...currentTransactions]);

    // Update user balance
    const currentUser = this.userSubject.value;
    const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
    this.userSubject.next({
      ...currentUser,
      balance: currentUser.balance + balanceChange
    });
  }
}
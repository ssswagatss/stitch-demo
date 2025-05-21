export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  merchant?: string;
  type: 'expense' | 'income';
}

export interface User {
  id: string;
  name: string;
  balance: number;
  avatar?: string;
}
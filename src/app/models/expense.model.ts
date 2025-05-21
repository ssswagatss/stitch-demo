export interface Expense {
    id: string;
    amount: number;
    category: ExpenseCategory;
    description?: string;
    merchant: string;
    date: Date;
    userId: string;
}

export enum ExpenseCategory {
    FOOD = 'Food',
    GROCERIES = 'Groceries',
    TRANSPORTATION = 'Transportation',
    ENTERTAINMENT = 'Entertainment',
    UTILITIES = 'Utilities',
    SHOPPING = 'Shopping',
    HEALTH = 'Health',
    TRAVEL = 'Travel',
    EDUCATION = 'Education',
    OTHER = 'Other'
} 
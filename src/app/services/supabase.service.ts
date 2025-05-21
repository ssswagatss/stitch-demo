import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Expense } from '../models/expense.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;
    private userSubject = new BehaviorSubject<User | null>(null);

    constructor() {
        this.supabase = createClient(
            environment.supabaseUrl,
            environment.supabaseKey
        );

        // Check for existing session
        this.supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                this.loadUser(session.user.id);
            }
        });

        // Listen for auth changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                this.loadUser(session.user.id);
            } else if (event === 'SIGNED_OUT') {
                this.userSubject.next(null);
            }
        });
    }

    get user$(): Observable<User | null> {
        return this.userSubject.asObservable();
    }

    async signIn(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    }

    async signUp(email: string, password: string, userData: Partial<User>) {
        const { data: authData, error: authError } = await this.supabase.auth.signUp({
            email,
            password
        });

        if (authError) throw authError;

        if (authData.user) {
            const { error: profileError } = await this.supabase
                .from('users')
                .insert([
                    {
                        id: authData.user.id,
                        email: authData.user.email,
                        ...userData
                    }
                ]);

            if (profileError) throw profileError;
        }

        return authData;
    }

    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;
    }

    private async loadUser(userId: string) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        if (data) {
            this.userSubject.next(data as User);
        }
    }

    // Expense related methods
    async getExpenses(userId: string): Promise<Expense[]> {
        const { data, error } = await this.supabase
            .from('expenses')
            .select('*')
            .eq('userId', userId)
            .order('date', { ascending: false });

        if (error) throw error;
        return data as Expense[];
    }

    async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
        const { data, error } = await this.supabase
            .from('expenses')
            .insert([expense])
            .select()
            .single();

        if (error) throw error;
        return data as Expense;
    }

    async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
        const { data, error } = await this.supabase
            .from('expenses')
            .update(expense)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Expense;
    }

    async deleteExpense(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('expenses')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // User profile methods
    async updateUser(userId: string, updates: Partial<User>): Promise<User> {
        const { data, error } = await this.supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        this.userSubject.next(data as User);
        return data as User;
    }

    // Add getCurrentUser method
    async getCurrentUser(): Promise<User | null> {
        const { data: { session }, error } = await this.supabase.auth.getSession();
        if (error) throw error;
        if (!session) return null;

        const { data: user, error: userError } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (userError) throw userError;
        return user;
    }
} 
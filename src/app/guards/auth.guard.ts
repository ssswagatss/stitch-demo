import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(
        private supabaseService: SupabaseService,
        private router: Router
    ) { }

    canActivate() {
        return this.supabaseService.user$.pipe(
            take(1),
            map(user => {
                if (user) {
                    return true;
                } else {
                    this.router.navigate(['/login']);
                    return false;
                }
            })
        );
    }
} 
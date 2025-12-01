import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, Admin } from './admin.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private isAuthenticated = false;
  private currentAdmin: Admin | null = null;

  async login(username: string, password: string): Promise<boolean> {
    try {
      const admin = await firstValueFrom(this.adminService.getAdminByUsername(username));
      if (admin && admin.password === password) {
        this.isAuthenticated = true;
        this.currentAdmin = admin;
        localStorage.setItem('admin', JSON.stringify(admin));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  logout() {
    this.isAuthenticated = false;
    this.currentAdmin = null;
    localStorage.removeItem('admin');
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated || !!localStorage.getItem('admin');
  }

  getCurrentAdmin(): Admin | null {
    if (this.currentAdmin) return this.currentAdmin;
    const stored = localStorage.getItem('admin');
    return stored ? JSON.parse(stored) : null;
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Admin {
  id_admin: number;
  nombre: string;
  apellido: string;
  telefono: string;
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/admin';

  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.baseUrl);
  }

  getAdminByUsername(username: string): Observable<Admin | null> {
    return this.http.get<Admin | null>(`${this.baseUrl}/by-username/${encodeURIComponent(username)}`);
  }

  addAdmin(data: Omit<Admin, 'id_admin'>): Observable<Admin> {
    return this.http.post<Admin>(this.baseUrl, data);
  }

  updateAdmin(id: number, data: Partial<Admin>): Observable<Admin> {
    return this.http.put<Admin>(`${this.baseUrl}/${id}`, data);
  }

  deleteAdmin(id: number): Observable<Admin> {
    return this.http.delete<Admin>(`${this.baseUrl}/${id}`);
  }
}

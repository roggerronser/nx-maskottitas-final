import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'apps/frontend/src/environments/environment';

export interface TipoVacuna {
  id_tipo_vacuna: number;
  tipo_vacuna: string;
}

@Injectable({ providedIn: 'root' })
export class TipoVacunaService {

  private apiUrl = `${environment.apiUrl}/tipo-vacuna`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoVacuna[]> {
    return this.http.get<TipoVacuna[]>(this.apiUrl);
  }

  getById(id: number): Observable<TipoVacuna> {
    return this.http.get<TipoVacuna>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<TipoVacuna, 'id_tipo_vacuna'>): Observable<TipoVacuna> {
    return this.http.post<TipoVacuna>(this.apiUrl, data);
  }

  update(id: number, data: Partial<TipoVacuna>): Observable<TipoVacuna> {
    return this.http.put<TipoVacuna>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

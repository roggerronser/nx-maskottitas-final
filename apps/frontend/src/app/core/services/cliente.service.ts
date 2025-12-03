import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface Cliente {
  id_cliente?: number;
  nombres: string;
  apellidos: string;
  direccion: string;
  telefono: number;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = `${API_BASE_URL}/cliente`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  add(data: Cliente): Observable<Cliente> {
    const { id_cliente, ...sinId } = data;
    return this.http.post<Cliente>(this.apiUrl, sinId);
  }

  update(data: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${data.id_cliente}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

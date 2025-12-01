import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id_cliente?: number;
  nombres: string;
  apellidos: string;
  direccion: string;
  telefono: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000/api/cliente'; // URL del backend

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

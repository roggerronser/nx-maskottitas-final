import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface Paciente {
  id_paciente: number;
  paciente: string;
  especie: string;
  raza: string;
  sexo: string;
  id_cliente: number;
}

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly API_URL = `${API_BASE_URL}/paciente`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.API_URL);
  }

  getById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.API_URL}/${id}`);
  }

  add(data: Omit<Paciente, 'id_paciente'>): Observable<Paciente> {
    return this.http.post<Paciente>(this.API_URL, data);
  }

  update(data: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.API_URL}/${data.id_paciente}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Resultado {
  id_resultado: number;
  diagnt_definitivo: string;
  tratamiento: string;
  prox_cita: string;
  observaciones: string;
  id_examen: number;
}

@Injectable({ providedIn: 'root' })
export class ResultadoService {
  private api = 'http://localhost:3000/api/resultado';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Resultado[]> {
    return this.http.get<Resultado[]>(this.api);
  }

  getById(id: number): Observable<Resultado> {
    return this.http.get<Resultado>(`${this.api}/${id}`);
  }

  create(data: Omit<Resultado, 'id_resultado'>): Observable<Resultado> {
    return this.http.post<Resultado>(this.api, data);
  }

  update(id: number, data: Partial<Resultado>): Observable<Resultado> {
    return this.http.put<Resultado>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<Resultado> {
    return this.http.delete<Resultado>(`${this.api}/${id}`);
  }
}

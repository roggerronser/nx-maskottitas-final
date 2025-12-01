import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Examen {
  id_examen: number;
  tipo_examen: string;
  diagnt_presuntivo: string;
  id_consulta: number;
}

@Injectable({ providedIn: 'root' })
export class ExamenService {
  private api = 'http://localhost:3000/api/examen';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Examen[]> {
    return this.http.get<Examen[]>(this.api);
  }

  getById(id: number): Observable<Examen> {
    return this.http.get<Examen>(`${this.api}/${id}`);
  }

  getByConsulta(id_consulta: number): Observable<Examen[]> {
    return this.http.get<Examen[]>(`${this.api}/consulta/${id_consulta}`);
  }

  create(data: Omit<Examen, 'id_examen'>): Observable<Examen> {
    return this.http.post<Examen>(this.api, data);
  }

  update(id: number, data: Partial<Examen>): Observable<Examen> {
    return this.http.put<Examen>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<Examen> {
    return this.http.delete<Examen>(`${this.api}/${id}`);
  }

  upload(file: File): Observable<{ filename: string }> {
    return new Observable(obs => {
      obs.next({ filename: file.name });
      obs.complete();
    });
  }
}

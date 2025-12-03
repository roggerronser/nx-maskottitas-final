import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface Consulta {
  id_consulta?: number;
  edad: number;
  anamnesis: string;
  caracteristica: string;
  temperatura: number;
  fc: number;
  fr: number;
  hidratacion: string;
  mucosas: string;
  tiempo_relleno_capilar: string;
  spo2: number;
  glucosa: number;
  presion_arterial: string;
  otros: string;
  fecha_consulta: string;
  estado_consulta: number;
  id_sintoma: number[];
  id_paciente: number;
}

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private api = `${API_BASE_URL}/consulta`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(this.api);
  }

  getById(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${this.api}/${id}`);
  }

  add(data: any): Observable<Consulta> {
    return this.http.post<Consulta>(this.api, data);
  }

  update(id: number, data: any): Observable<Consulta> {
    return this.http.put<Consulta>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<Consulta> {
    return this.http.delete<Consulta>(`${this.api}/${id}`);
  }
}

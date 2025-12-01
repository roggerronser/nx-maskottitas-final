import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Vacuna {
  id_vacuna: number;
  temperatura_vacuna: string;
  fc_vacuna: string;
  fr_vacuna: string;
  mucosa_vacuna: string;
  aplicacion_vacuna: string;
  fecha_vacuna: Date;
  proxima_vacuna: Date;
  estado_vacuna: number;
  id_tipo_vacuna: number[];
  id_paciente: number;
}

@Injectable({ providedIn: 'root' })
export class VacunaService {
  private api = 'http://localhost:3000/api/vacuna';

  constructor(private http: HttpClient) {}

  private adaptVacuna(v: any): Vacuna {
    return {
      id_vacuna: Number(v.id_vacuna),
      temperatura_vacuna: v.temperatura_vacuna,
      fc_vacuna: v.fc_vacuna,
      fr_vacuna: v.fr_vacuna,
      mucosa_vacuna: v.mucosa_vacuna,
      aplicacion_vacuna: v.aplicacion_vacuna,
      fecha_vacuna: v.fecha_vacuna,
      proxima_vacuna: v.proxima_vacuna,
      estado_vacuna: v.estado_vacuna,
  
      id_tipo_vacuna: v.tipos_vacuna?.map((t: any) => t.id_tipo_vacuna) ?? [],
  
      // 🔥 ESTA ES LA CORRECCIÓN
      id_paciente: Number(v.id_paciente ?? v.paciente?.id_paciente)
    };
  }
  
  

  getAll(): Observable<Vacuna[]> {
    return this.http.get<any[]>(this.api).pipe(
      map(vs => vs.map(v => this.adaptVacuna(v)))
    );
  }

  getById(id: number): Observable<Vacuna> {
    return this.http.get<any>(`${this.api}/${id}`).pipe(
      map(v => this.adaptVacuna(v))
    );
  }

  add(data: any): Observable<Vacuna> {
    return this.http.post<any>(this.api, data).pipe(
      map(v => this.adaptVacuna(v))
    );
  }

  update(data: any): Observable<Vacuna> {
    return this.http.put<any>(`${this.api}/${data.id_vacuna}`, data).pipe(
      map(v => this.adaptVacuna(v))
    );
  }

  updateParcial(id: number, data: any): Observable<Vacuna> {
    return this.http.put<any>(`${this.api}/${id}`, data).pipe(
      map(v => this.adaptVacuna(v))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}

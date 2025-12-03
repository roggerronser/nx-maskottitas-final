import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface Sintoma {
  id_sintoma: number;
  sintoma: string;
}

@Injectable({ providedIn: 'root' })
export class SintomaService {
  private api = `${API_BASE_URL}/sintoma`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sintoma[]> {
    return this.http.get<Sintoma[]>(this.api);
  }

  getById(id: number): Observable<Sintoma> {
    return this.http.get<Sintoma>(`${this.api}/${id}`);
  }

  add(data: { sintoma: string }): Observable<Sintoma> {
    return this.http.post<Sintoma>(this.api, data);
  }

  update(id: number, data: { sintoma: string }): Observable<Sintoma> {
    return this.http.put<Sintoma>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<Sintoma> {
    return this.http.delete<Sintoma>(`${this.api}/${id}`);
  }
}

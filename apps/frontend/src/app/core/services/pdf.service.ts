import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface Pdf {
  id_pdf: number;
  pdf: string;
  id_examen: number;
}

@Injectable({ providedIn: 'root' })
export class PdfService {
  private api = `${API_BASE_URL}/pdf`;

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<{ filename: string }> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ filename: string }>(
      `${this.api}/upload`,
      form
    );
  }

  addPdf(pdf: string, id_examen: number): Observable<Pdf> {
    return this.http.post<Pdf>(this.api, { pdf, id_examen });
  }

  getPdfsByExam(id_examen: number): Observable<Pdf[]> {
    return this.http.get<Pdf[]>(`${this.api}/examen/${id_examen}`);
  }

  delete(id_pdf: number) {
    return this.http.delete(`${this.api}/${id_pdf}`);
  }
}

import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Examen, ExamenService } from 'apps/frontend/src/app/core/services/examen.service';
import { Pdf, PdfService } from 'apps/frontend/src/app/core/services/pdf.service';

import { ExamenEditAddComponent } from './examen-edit-add/examen-edit-add.component';
import { AlertaComponent } from 'apps/frontend/src/app/shared/components/alerta/alerta.component';
import { PdfComponent } from './examen-edit-add/pdf/pdf.component';


@Component({
  selector: 'app-examen',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
  ],
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamenComponent implements OnInit {

  @Input() idConsulta?: number;

  examenes = signal<Examen[]>([]);
  pdfsPorExamen = signal<Record<number, Pdf[]>>({});

  constructor(
    private examenService: ExamenService,
    private pdfService: PdfService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarExamenes();
  }

  cargarExamenes() {
    if (!this.idConsulta) {
      this.examenes.set([]);
      return;
    }

    this.examenService.getByConsulta(this.idConsulta).subscribe(lista => {
      this.examenes.set(lista);

      lista.forEach(examen => {
        this.pdfService.getPdfsByExam(examen.id_examen).subscribe(pdfs => {
          this.pdfsPorExamen.update(prev => ({
            ...prev,
            [examen.id_examen]: pdfs
          }));
        });
      });
    });
  }

  agregar() {
    const ref = this.dialog.open(ExamenEditAddComponent, {
      width: '600px',
      data: { id_consulta: this.idConsulta }
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.cargarExamenes();
    });
  }

  editar(examen: Examen) {
    const ref = this.dialog.open(ExamenEditAddComponent, {
      width: '600px',
      data: { examen, id_consulta: this.idConsulta }
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.cargarExamenes();
    });
  }

  eliminar(id: number) {
    const ref = this.dialog.open(AlertaComponent, {
      width: '400px',
      data: { mensaje: '¿Eliminar examen?' }
    });

    ref.afterClosed().subscribe(confirm => {
      if (!confirm) return;

      this.examenService.delete(id).subscribe(() => this.cargarExamenes());
    });
  }

  verPdf(nombre: string) {
    window.open(`http://localhost:3000/api/pdf/${nombre}`, '_blank');
  }
  
  descargarPdf(nombre: string) {
    window.open(`http://localhost:3000/api/pdf/${nombre}`, '_blank');
  }
  
  
  
  agregarPdf(examen: Examen, event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
  
    const file = input.files[0];
  
    this.pdfService.upload(file).subscribe(res => {
      this.pdfService.addPdf(res.filename, examen.id_examen).subscribe(() => {
        this.pdfService.getPdfsByExam(examen.id_examen).subscribe(lista => {
          this.pdfsPorExamen.update(prev => ({
            ...prev,
            [examen.id_examen]: lista
          }));
        });
      });
    });
  
    input.value = '';
  }
  
  
  
}

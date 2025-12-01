import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ExamenService, Examen } from 'apps/frontend/src/app/core/services/examen.service';
import { Pdf, PdfService } from 'apps/frontend/src/app/core/services/pdf.service';
import { AlertaComponent } from 'apps/frontend/src/app/shared/components/alerta/alerta.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-examen-edit-add',
  standalone: true,
  providers: [PdfService],   // ✅ AÑADIDO AQUÍ
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIcon
  ],
  templateUrl: './examen-edit-add.component.html',
  styleUrls: ['./examen-edit-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamenEditAddComponent implements OnInit {

  form!: FormGroup;
  archivosNuevos: File[] = [];
  pdfsExistentes: Pdf[] = [];
  titulo = 'Agregar Examen';

  constructor(
    private fb: FormBuilder,
    private examenService: ExamenService,
    private pdfService: PdfService,      // ✅ Ahora SI funciona
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ExamenEditAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { examen?: Examen; id_consulta: number }
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipo_examen: [this.data.examen?.tipo_examen || '', Validators.required],
      diagnt_presuntivo: [this.data.examen?.diagnt_presuntivo || '', Validators.required]
    });

    if (this.data.examen) {
      this.titulo = 'Editar Examen';

      this.pdfService.getPdfsByExam(this.data.examen.id_examen)
        .subscribe(lista => this.pdfsExistentes = lista);
    }
  }

  seleccionarArchivos(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(f => this.archivosNuevos.push(f));
  }

  eliminarPdfExistente(pdf: Pdf) {
    const ref = this.dialog.open(AlertaComponent, {
      data: { mensaje: `¿Eliminar el PDF "${pdf.pdf}"?` }
    });

    ref.afterClosed().subscribe(ok => {
      if (!ok) return;

      this.pdfService.delete(pdf.id_pdf).subscribe(() => {
        this.pdfsExistentes = this.pdfsExistentes.filter(p => p.id_pdf !== pdf.id_pdf);
      });
    });
  }

  eliminarPdfNuevo(nombre: string) {
    this.archivosNuevos = this.archivosNuevos.filter(f => f.name !== nombre);
  }

  guardar() {
    if (this.form.invalid) return;

    const ref = this.dialog.open(AlertaComponent, {
      data: { mensaje: '¿Confirmar acción?' }
    });

    ref.afterClosed().subscribe(ok => {
      if (!ok) return;

      if (this.data.examen) this.actualizar();
      else this.crear();
    });
  }

  crear() {
    const body = {
      tipo_examen: this.form.value.tipo_examen,
      diagnt_presuntivo: this.form.value.diagnt_presuntivo,
      id_consulta: this.data.id_consulta
    };

    this.examenService.create(body).subscribe(ex => {
      this.subirPdfs(ex.id_examen);
      this.dialogRef.close(true);
    });
  }

  actualizar() {
    const body: Examen = {
      ...this.form.value,
      id_examen: this.data.examen!.id_examen,
      id_consulta: this.data.id_consulta
    };

    this.examenService.update(body.id_examen, body).subscribe(() => {
      this.subirPdfs(body.id_examen);
      this.dialogRef.close(true);
    });
  }

  /** ⬆ Subir PDFs NUEVOS */
  subirPdfs(id_examen: number) {
    this.archivosNuevos.forEach(file => {
      this.pdfService.upload(file).subscribe(res => {   // ✅ CORREGIDO
        this.pdfService.addPdf(res.filename, id_examen).subscribe();
      });
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}

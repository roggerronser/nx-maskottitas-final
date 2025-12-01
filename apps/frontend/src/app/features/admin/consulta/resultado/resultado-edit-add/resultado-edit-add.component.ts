import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlertaComponent } from 'apps/frontend/src/app/shared/components/alerta/alerta.component';
import { Examen } from 'apps/frontend/src/app/core/services/examen.service';

@Component({
  selector: 'app-resultado-edit-add',
  standalone: true,
  templateUrl: './resultado-edit-add.component.html',
  styleUrls: ['./resultado-edit-add.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class ResultadoEditAddComponent implements OnInit {
  form!: FormGroup;
  modoEdicion = false;
  examenes: Examen[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ResultadoEditAddComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.modoEdicion = !!this.data?.resultado;
    this.examenes = this.data?.examenes || [];

    this.form = this.fb.group({
      id_examen: [this.data?.resultado?.id_examen || '', Validators.required],
      diagnt_definitivo: [this.data?.resultado?.diagnt_definitivo || '', Validators.required],
      tratamiento: [this.data?.resultado?.tratamiento || '', Validators.required],
    
      /* 🔥 FECHA SIN HORAS */
      prox_cita: [
        this.data?.resultado?.prox_cita
          ? new Date(this.data.resultado.prox_cita).toISOString().substring(0, 10)
          : new Date().toISOString().substring(0, 10),
        Validators.required
      ],
    
      observaciones: [this.data?.resultado?.observaciones || ''],
    });
    
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    const mensaje = this.modoEdicion
      ? '¿Deseas actualizar este resultado?'
      : '¿Deseas guardar este nuevo resultado?';

    const alertaRef = this.dialog.open(AlertaComponent, {
      data: {
        titulo: 'Confirmar acción',
        mensaje,
        tipo: 'confirmacion',
      },
      width: '400px',
      disableClose: true,
    });

    alertaRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {

        // ⬅ CONVERTIR FECHA A FORMATO COMPATIBLE PARA PRISMA
        const valores = {
          ...this.form.value,
          prox_cita: new Date(this.form.value.prox_cita),
        };

        this.dialogRef.close(valores);
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TipoVacuna, TipoVacunaService } from 'apps/frontend/src/app/core/services/tipo-vacuna.service';


@Component({
  selector: 'app-tipo-vacuna',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './tipo-vacuna.component.html',
  styleUrls: ['./tipo-vacuna.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TipoVacunaComponent implements OnInit {

  nuevoTipoValue: string = '';   // 👈 RESTAURADO
  modo: 'add' | 'edit' = 'add';
  tipoEditar?: TipoVacuna;

  constructor(
    private tipoVacunaService: TipoVacunaService,
    public dialogRef: MatDialogRef<TipoVacunaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipo?: TipoVacuna }
  ) {}

  ngOnInit(): void {
    if (this.data?.tipo) {
      this.modo = 'edit';
      this.tipoEditar = { ...this.data.tipo };
      this.nuevoTipoValue = this.tipoEditar.tipo_vacuna;
    }
  }

  guardar() {
    const nombre = this.nuevoTipoValue.trim();
    if (!nombre) return;

    if (this.modo === 'add') {
      this.tipoVacunaService.create({ tipo_vacuna: nombre })
        .subscribe(nuevo => this.dialogRef.close(nuevo));

    } else if (this.tipoEditar) {
      this.tipoVacunaService
        .update(this.tipoEditar.id_tipo_vacuna, { tipo_vacuna: nombre })
        .subscribe(editado => this.dialogRef.close(editado));
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}

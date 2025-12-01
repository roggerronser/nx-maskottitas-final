import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  Inject
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AlertaComponent } from 'apps/frontend/src/app/shared/components/alerta/alerta.component';
import { PacienteService, Paciente } from 'apps/frontend/src/app/core/services/paciente.service';
import { ClienteService, Cliente } from 'apps/frontend/src/app/core/services/cliente.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-añadir-paciente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
  ],
  templateUrl: './añadir-paciente.component.html',
  styleUrls: ['./añadir-paciente.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AñadirPacienteComponent implements OnInit {

  pacienteForm!: FormGroup;
  clientes: Cliente[] = [];
  pacientesPrevios: Paciente[] = [];
  modoEditar = false;

  private clienteService = inject(ClienteService);
  private pacienteService = inject(PacienteService);
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<AñadirPacienteComponent>);
  private fb = inject(FormBuilder);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Paciente | null) {}

  ngOnInit(): void {
    this.pacienteForm = this.fb.group({
      id_paciente: [null],
      paciente: ['', Validators.required],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      sexo: ['', Validators.required],
      id_cliente: [null, Validators.required],
    });

    this.clienteService.getAll().subscribe(c => this.clientes = c);
    this.pacienteService.getAll().subscribe(p => this.pacientesPrevios = p);

    if (this.data) {
      this.modoEditar = true;
      this.pacienteForm.patchValue(this.data);
    }

    this.autocompletarSiExiste();
  }

  // ===================================================
  // 🔥 AUTOCOMPLETAR PACIENTE SI YA EXISTE UNO PREVIO
  // ===================================================
  autocompletarSiExiste(): void {
    this.pacienteForm.get('paciente')?.valueChanges.subscribe(nombre => {
      if (!nombre || this.modoEditar) return;

      const encontrado = this.pacientesPrevios.find(
        p => p.paciente.toLowerCase().trim() === nombre.toLowerCase().trim()
      );

      if (encontrado) {
        this.pacienteForm.patchValue({
          especie: encontrado.especie,
          raza: encontrado.raza,
          sexo: encontrado.sexo,
          id_cliente: encontrado.id_cliente
        });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (!this.pacienteForm.valid) return;

    const paciente: Paciente = this.pacienteForm.value;

    const mensaje = this.modoEditar
      ? '¿Desea guardar los cambios del paciente?'
      : '¿Está seguro de crear este paciente?';

    const alertaRef = this.dialog.open(AlertaComponent, {
      width: '350px',
      data: { mensaje },
    });

    alertaRef.afterClosed().subscribe(confirmado => {
      if (!confirmado) return;

      if (this.modoEditar) {
        this.pacienteService.update(paciente).subscribe({
          next: () => this.dialogRef.close('refresh'),
          error: (err) => console.error('Error al editar:', err)
        });
      } else {
        const { id_paciente, ...nuevoPaciente } = paciente;
        this.pacienteService.add(nuevoPaciente).subscribe({
          next: () => this.dialogRef.close('refresh'),
          error: (err) => console.error('Error al crear:', err)
        });
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ClienteService, Cliente } from '../../../../core/services/cliente.service';
import { ConsultaService, Consulta } from '../../../../core/services/consulta.service';
import { PacienteService, Paciente } from '../../../../core/services/paciente.service';
import { SintomaService, Sintoma } from '../../../../core/services/sintoma.service';

import { SintomaEditAddComponent } from './sintoma-edit-add/sintoma-edit-add.component';
import { AlertaComponent } from 'apps/frontend/src/app/shared/components/alerta/alerta.component';

@Component({
  selector: 'app-consulta-edit-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './consulta-edit-add.component.html',
  styleUrls: ['./consulta-edit-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultaEditAddComponent implements OnInit {

  private clienteService = inject(ClienteService);
  private pacienteService = inject(PacienteService);
  private consultaService = inject(ConsultaService);
  private sintomaService = inject(SintomaService);
  private dialogRef = inject(MatDialogRef<ConsultaEditAddComponent>);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  form!: FormGroup;
  clientes: Cliente[] = [];
  pacientes: Paciente[] = [];
  sintomas: Sintoma[] = [];
  modoEditar = false;

  ngOnInit(): void {
    this.cargarBase();
    this.configurar();
  }

  cargarBase(): void {
    this.clienteService.getAll().subscribe(c => this.clientes = c);
    this.sintomaService.getAll().subscribe(s => this.sintomas = s);
  }

  configurar(): void {
    this.form = this.fb.group({
      id_consulta: [null],
      id_cliente: [null, Validators.required],
      id_paciente: [null, Validators.required],
      fecha_consulta: ['', Validators.required],
      estado_consulta: [0, Validators.required],
      edad: ['', Validators.required],
      temperatura: ['', Validators.required],
      fc: ['', Validators.required],
      fr: ['', Validators.required],
      hidratacion: ['', Validators.required],
      mucosas: ['', Validators.required],
      tiempo_relleno_capilar: ['', Validators.required],
      spo2: ['', Validators.required],
      glucosa: ['', Validators.required],
      presion_arterial: ['', Validators.required],
      anamnesis: ['', Validators.required],
      caracteristica: ['', Validators.required],
      id_sintoma: [[], Validators.required],
      otros: [''],
    });

    let cargandoEdicion = false;

    this.form.get('id_cliente')!.valueChanges.subscribe((id) => {
      if (cargandoEdicion) return;
      if (!id) {
        this.pacientes = [];
        this.form.patchValue({ id_paciente: null });
        return;
      }
      this.cargarPacientes(id);
      this.form.patchValue({ id_paciente: null });
    });

    if (this.data?.consulta) {
      const c = this.data.consulta;
      this.modoEditar = true;
      cargandoEdicion = true;

      const fecha = new Date(c.fecha_consulta).toISOString().substring(0, 10);

      this.pacienteService.getById(c.id_paciente).subscribe((p) => {
        if (!p) return;

        this.form.patchValue({ id_cliente: p.id_cliente });
        this.cargarPacientes(p.id_cliente);

        setTimeout(() => {
          this.form.patchValue({
            ...c,
            fecha_consulta: fecha,
            id_paciente: c.id_paciente,
          });
          cargandoEdicion = false;
        }, 150);
      });

      return;
    }

    if (this.data?.id_paciente) {
      this.pacienteService.getById(this.data.id_paciente).subscribe((p) => {
        if (p) {
          this.form.patchValue({ id_cliente: p.id_cliente });
          this.cargarPacientes(p.id_cliente);

          setTimeout(() => {
            this.form.patchValue({ id_paciente: p.id_paciente });
          }, 120);
        }
      });
    }

    const hoy = new Date().toISOString().substring(0, 10);
    this.form.patchValue({ fecha_consulta: hoy });

    if (this.data?.ultimaConsulta) {
      const u = this.data.ultimaConsulta;
      this.form.patchValue({
        edad: u.edad,
        temperatura: u.temperatura,
        fc: u.fc,
        fr: u.fr,
        hidratacion: u.hidratacion,
        mucosas: u.mucosas,
        tiempo_relleno_capilar: u.tiempo_relleno_capilar,
        spo2: u.spo2,
        glucosa: u.glucosa,
        presion_arterial: u.presion_arterial,
      });
    }
  }

  cargarPacientes(id: number): void {
    this.pacienteService.getAll().subscribe(p => {
      this.pacientes = p.filter(pa => pa.id_cliente === id);
    });
  }

  crearSintoma(): void {
    const ref = this.dialog.open(SintomaEditAddComponent, { width: '400px', data: null });
    ref.afterClosed().subscribe(() => this.sintomaService.getAll().subscribe((s) => (this.sintomas = s)));
  }

  editarSintoma(s: Sintoma, event: Event): void {
    event.stopPropagation();
    const ref = this.dialog.open(SintomaEditAddComponent, { width: '400px', data: s });
    ref.afterClosed().subscribe(() => this.sintomaService.getAll().subscribe((s) => (this.sintomas = s)));
  }

  eliminarSintoma(s: Sintoma, event: Event): void {
    event.stopPropagation();
    const ref = this.dialog.open(AlertaComponent, {
      width: '400px',
      data: { mensaje: `¿Deseas eliminar el síntoma "${s.sintoma}"?`, tipo: 'confirmacion' },
    });

    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;
      this.sintomaService.delete(s.id_sintoma).subscribe(() => {
        this.sintomas = this.sintomas.filter((x) => x.id_sintoma !== s.id_sintoma);
      });
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.dialog.open(AlertaComponent, {
        width: '400px',
        data: { titulo: 'Formulario incompleto', mensaje: 'Completa todos los campos.', tipo: 'advertencia' },
      });
      return;
    }

    const ref = this.dialog.open(AlertaComponent, {
      width: '400px',
      data: { mensaje: '¿Deseas guardar esta consulta?', tipo: 'confirmacion' },
    });

    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;

      const v = this.form.value;

      const body = {
        edad: Number(v.edad),
        temperatura: Number(v.temperatura),
        fc: Number(v.fc),
        fr: Number(v.fr),
        spo2: Number(v.spo2),
        glucosa: Number(v.glucosa),
        hidratacion: v.hidratacion,
        mucosas: v.mucosas,
        tiempo_relleno_capilar: v.tiempo_relleno_capilar,
        presion_arterial: v.presion_arterial,
        anamnesis: v.anamnesis,
        caracteristica: v.caracteristica,
        otros: v.otros,
        fecha_consulta: v.fecha_consulta,
        estado_consulta: Number(v.estado_consulta),
        id_paciente: Number(v.id_paciente),
        id_sintoma: v.id_sintoma,
      };

      if (this.modoEditar && v.id_consulta) {
        this.consultaService.update(v.id_consulta, body).subscribe(() => this.dialogRef.close(true));
      } else {
        this.consultaService.add(body).subscribe(() => this.dialogRef.close(true));
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

import { Paciente, PacienteService } from '../../../../core/services/paciente.service';
import { TipoVacuna, TipoVacunaService } from '../../../../core/services/tipo-vacuna.service';
import { Vacuna, VacunaService } from '../../../../core/services/vacuna.service';
import { Cliente, ClienteService } from '../../../../core/services/cliente.service';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';
import { TipoVacunaComponent } from './tipo-vacuna/tipo-vacuna.component';

@Component({
  selector: 'app-vacuna-edit-add',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-PE' }],
  templateUrl: './vacuna-edit-add.component.html',
  styleUrls: ['./vacuna-edit-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacunaEditAddComponent implements OnInit {

  vacuna: Vacuna = {
    id_vacuna: 0,
    temperatura_vacuna: '',
    fc_vacuna: '',
    fr_vacuna: '',
    mucosa_vacuna: '',
    aplicacion_vacuna: '',
    fecha_vacuna: new Date(),
    proxima_vacuna: new Date(),
    estado_vacuna: 0,
    id_tipo_vacuna: [],
    id_paciente: 0,
  };

  modo: 'add' | 'edit' = 'add';
  tiposVacuna = signal<TipoVacuna[]>([]);
  pacientes: Paciente[] = [];
  clientes: Cliente[] = [];
  pacientesFiltrados: Paciente[] = [];
  clienteSeleccionado: number | null = null;
  aplicacionesDisponibles: string[] = [];
  datosListos = signal<boolean>(false);

  recalculoManual = false;

  constructor(
    private vacunaService: VacunaService,
    private tipoVacunaService: TipoVacunaService,
    private pacienteService: PacienteService,
    private clienteService: ClienteService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<VacunaEditAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vacuna?: Vacuna, id_paciente?: number, ultimaVacuna?: Vacuna }
  ) {}

  sumarDias(f: Date, d: number): Date {
    const n = new Date(f);
    n.setDate(n.getDate() + d);
    return n;
  }

  recalcularProxima() {
    if (this.recalculoManual) return;
    if (this.modo === 'edit') return;
    this.vacuna.proxima_vacuna = this.sumarDias(this.vacuna.fecha_vacuna, 15);
  }

  onProximaEdit() {
    this.recalculoManual = true;
  }

  ngOnInit(): void {
    Promise.all([
      this.tipoVacunaService.getAll().toPromise(),
      this.pacienteService.getAll().toPromise(),
      this.clienteService.getAll().toPromise(),
    ]).then(([t, p, c]) => {
      this.tiposVacuna.set(t || []);
      this.pacientes = p || [];
      this.clientes = c || [];

      if (this.data?.vacuna) {
        this.modo = 'edit';
        const v = structuredClone(this.data.vacuna);
        v.fecha_vacuna = new Date(v.fecha_vacuna);
        v.proxima_vacuna = new Date(v.proxima_vacuna);
        this.vacuna = v;

        const pac = this.pacientes.find(x => x.id_paciente === v.id_paciente);
        if (pac) {
          this.clienteSeleccionado = pac.id_cliente;
          this.filtrarPacientesPorCliente(pac.id_cliente);
          this.actualizarAplicacionesPorEspecie();
        }

        this.datosListos.set(true);
        return;
      }

      if (this.data?.id_paciente) {
        this.modo = 'add';
        this.vacuna.id_paciente = this.data.id_paciente;

        const pac = this.pacientes.find(x => x.id_paciente === this.data.id_paciente);
        if (pac) {
          this.clienteSeleccionado = pac.id_cliente;
          this.filtrarPacientesPorCliente(pac.id_cliente);
          this.actualizarAplicacionesPorEspecie();
        }

        if (this.data.ultimaVacuna) {
          const u = this.data.ultimaVacuna;
          this.vacuna.temperatura_vacuna = u.temperatura_vacuna;
          this.vacuna.fc_vacuna = u.fc_vacuna;
          this.vacuna.fr_vacuna = u.fr_vacuna;
          this.vacuna.mucosa_vacuna = u.mucosa_vacuna;
        }

        const hoy = new Date();
        this.vacuna.fecha_vacuna = hoy;
        this.vacuna.proxima_vacuna = this.sumarDias(hoy, 15);

        this.datosListos.set(true);
        return;
      }

      this.datosListos.set(true);
    });
  }

  filtrarPacientesPorCliente(id: number) {
    this.clienteSeleccionado = id;
    this.pacientesFiltrados = this.pacientes.filter(x => x.id_cliente === id);
  }

  actualizarAplicacionesPorEspecie() {
    const p = this.pacientes.find(x => x.id_paciente === this.vacuna.id_paciente);
    if (!p) return;

    this.aplicacionesDisponibles =
      p.especie.toLowerCase() === 'perro'
        ? ['Puppy Plus', 'Cuádruple', 'Quíntuple', 'Séxtuple', 'Refuerzo anual', 'Antirrábica']
        : ['Triple felina', 'Leucemia', 'Antirrábica'];
  }

  actualizarTiposPorAplicacion() {
    if (this.modo === 'edit') return;
    const app = this.vacuna.aplicacion_vacuna.toLowerCase();
    const tipos = this.tiposVacuna();
    const sel: number[] = [];

    const add = (n: string[]) => {
      tipos
        .filter(t => n.some(x => t.tipo_vacuna.toLowerCase().includes(x.toLowerCase())))
        .forEach(t => sel.push(t.id_tipo_vacuna));
    };

    if (app.includes('puppy plus')) add(['distemper', 'parvovirus']);
    if (app.includes('cuadruple')) add(['distemper', 'parvovirus', 'hepatitis', 'parainfluenza']);
    if (app.includes('quintuple')) add(['distemper', 'parvovirus', 'hepatitis', 'parainfluenza', 'leptospira']);
    if (app.includes('sextuple')) add(['distemper', 'parvovirus', 'hepatitis', 'parainfluenza', 'leptospira', 'rabia']);
    if (app.includes('refuerzo anual')) add(['distemper', 'parvovirus', 'hepatitis', 'parainfluenza', 'leptospira', 'rabia']);
    if (app.includes('triple felina')) add(['rinotraqueitis', 'calicivirus', 'panleucopenia']);
    if (app.includes('leucemia')) add(['leucemia']);
    if (app.includes('antirrabica')) add(['rabia']);

    this.vacuna.id_tipo_vacuna = sel;
  }

  editarTipo(t: TipoVacuna) {
    this.dialog.open(TipoVacunaComponent, {
      width: '400px',
      data: { tipo: t }
    }).afterClosed().subscribe(r => {
      if (r) {
        this.tiposVacuna.update(x =>
          x.map(y => y.id_tipo_vacuna === r.id_tipo_vacuna ? r : y)
        );
      }
    });
  }

  eliminarTipo(t: TipoVacuna) {
    this.dialog.open(AlertaComponent, {
      data: { mensaje: `¿Deseas eliminar "${t.tipo_vacuna}"?` }
    }).afterClosed().subscribe(c => {
      if (!c) return;

      this.tipoVacunaService.delete(t.id_tipo_vacuna).subscribe(() => {
        this.tiposVacuna.update(x => x.filter(y => y.id_tipo_vacuna !== t.id_tipo_vacuna));
        this.vacuna.id_tipo_vacuna = this.vacuna.id_tipo_vacuna.filter(id => id !== t.id_tipo_vacuna);
      });
    });
  }

  guardarVacuna() {
    const p = {
      aplicacion_vacuna: this.vacuna.aplicacion_vacuna,
      temperatura_vacuna: this.vacuna.temperatura_vacuna,
      fc_vacuna: this.vacuna.fc_vacuna,
      fr_vacuna: this.vacuna.fr_vacuna,
      mucosa_vacuna: this.vacuna.mucosa_vacuna,
      fecha_vacuna: this.vacuna.fecha_vacuna,
      proxima_vacuna: this.vacuna.proxima_vacuna,
      estado_vacuna: this.vacuna.estado_vacuna,
      id_paciente: this.vacuna.id_paciente,
      tipos_vacuna: this.vacuna.id_tipo_vacuna.map(id => ({ id_tipo_vacuna: id })),
    };

    if (this.modo === 'add') {
      this.vacunaService.add(p).subscribe(r => this.dialogRef.close(r));
    } else {
      this.vacunaService.update({
        id_vacuna: this.vacuna.id_vacuna,
        ...p
      }).subscribe(r => this.dialogRef.close(r));
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  abrirAgregarNuevoTipo() {
    const ref = this.dialog.open(TipoVacunaComponent, {
      width: '400px',
      data: { tipo: null }
    });

    ref.afterClosed().subscribe(r => {
      if (!r) return;
      this.tiposVacuna.update(x => [...x, r]);
      if (!this.vacuna.id_tipo_vacuna.includes(r.id_tipo_vacuna)) {
        this.vacuna.id_tipo_vacuna.push(r.id_tipo_vacuna);
      }
    });
  }
}

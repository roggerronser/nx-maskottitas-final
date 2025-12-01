import { Component, OnInit, OnChanges, SimpleChanges, inject, signal, HostListener, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { VacunaService, Vacuna } from '../../../core/services/vacuna.service';
import { TipoVacunaService, TipoVacuna } from '../../../core/services/tipo-vacuna.service';
import { PacienteService, Paciente } from '../../../core/services/paciente.service';
import { ClienteService, Cliente } from '../../../core/services/cliente.service';

import { VacunaEditAddComponent } from './vacuna-edit-add/vacuna-edit-add.component';
import { AlertaComponent } from '../../../shared/components/alerta/alerta.component';

@Component({
  selector: 'app-vacuna',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    VacunaEditAddComponent,
    AlertaComponent
  ],
  providers: [DatePipe],
  templateUrl: './vacuna.component.html',
  styleUrls: ['./vacuna.component.scss'],
})
export class VacunaComponent implements OnInit, OnChanges {

  @Input() vacunasExternas?: Vacuna[];

  private vacunaService = inject(VacunaService);
  private tipoVacunaService = inject(TipoVacunaService);
  private pacienteService = inject(PacienteService);
  private clienteService = inject(ClienteService);
  private dialog = inject(MatDialog);
  private datePipe = inject(DatePipe);

  vacunas = signal<Vacuna[]>([]);
  dataSource = signal<Vacuna[]>([]);

  tiposVacuna: TipoVacuna[] = [];
  pacientes: Paciente[] = [];
  clientes: Cliente[] = [];

  filtro = signal<string>('');
  expandedVacuna = signal<Vacuna | null>(null);

  isSmallScreen = window.innerWidth < 768;
  datosListos = signal<boolean>(false);

  columnas = [
    'aplicacion',
    'especie',
    'paciente',
    'cliente',
    'fecha_vacuna',
    'proxima_vacuna',
    'estado',
    'acciones'
  ];

  @HostListener('window:resize', [])
  onResize() {
    this.isSmallScreen = window.innerWidth < 768;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vacunasExternas'] && this.vacunasExternas) {
      this.vacunas.set([...this.vacunasExternas]);
      this.dataSource.set([...this.vacunasExternas]);
    }
  }

  ngOnInit(): void {
    if (this.vacunasExternas?.length) {
      this.vacunas.set([...this.vacunasExternas]);
      this.dataSource.set([...this.vacunasExternas]);
      this.cargarListasAuxiliares();
      this.datosListos.set(true);
      return;
    }
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.datosListos.set(false);

    Promise.all([
      this.vacunaService.getAll().toPromise(),
      this.tipoVacunaService.getAll().toPromise(),
      this.pacienteService.getAll().toPromise(),
      this.clienteService.getAll().toPromise(),
    ]).then(([v, t, p, c]) => {
      if (!this.vacunasExternas) {
        this.vacunas.set(v || []);
        this.dataSource.set(v || []);
      }
      this.tiposVacuna = t || [];
      this.pacientes = p || [];
      this.clientes = c || [];
      this.datosListos.set(true);
    });
  }

  cargarListasAuxiliares() {
    Promise.all([
      this.tipoVacunaService.getAll().toPromise(),
      this.pacienteService.getAll().toPromise(),
      this.clienteService.getAll().toPromise(),
    ]).then(([t, p, c]) => {
      this.tiposVacuna = t || [];
      this.pacientes = p || [];
      this.clientes = c || [];
    });
  }

  vacunasFiltradasInterno(): Vacuna[] {
    const text = this.filtro().toLowerCase();
    const baseVacunas = this.vacunasExternas ?? this.vacunas();

    return baseVacunas.filter(v => {
      const paciente = this.getPacienteNombre(v.id_paciente).toLowerCase();
      const cliente = this.getClienteInfo(v.id_paciente).toLowerCase();
      const aplicacion = v.aplicacion_vacuna.toLowerCase();
      const especie = this.getEspecie(v.id_paciente).toLowerCase();
      const estado = this.getEstadoTexto(v).toLowerCase();

      return (
        aplicacion.includes(text) ||
        especie.includes(text) ||
        paciente.includes(text) ||
        cliente.includes(text) ||
        estado.includes(text)
      );
    });
  }

  vacunasFiltradas(): Vacuna[] {
    const resultado = this.vacunasFiltradasInterno();
    this.dataSource.set(resultado);
    return resultado;
  }

  toggleExpand(v: Vacuna): void {
    const current = this.expandedVacuna();
    this.expandedVacuna.set(current?.id_vacuna === v.id_vacuna ? null : v);
  }

  isExpanded(v: Vacuna): boolean {
    return this.expandedVacuna()?.id_vacuna === v.id_vacuna;
  }

  trackByVacuna(index: number, item: Vacuna) {
    return item.id_vacuna;
  }

  // ===========================================================
  // 🔥 FUNCIÓN NUEVA: sumar días
  // ===========================================================
  sumarDias(fecha: Date, dias: number): Date {
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + dias);
    return nueva;
  }

  // ===========================================================
  // 🔥 CAMBIO: al crear vacuna → fecha actual y +15 días automático
  // ===========================================================
  agregarVacuna(): void {
    let ultimaVacuna = null;

    if (this.vacunasExternas?.length) {
      ultimaVacuna = this.vacunasExternas[this.vacunasExternas.length - 1];
    }

    const hoy = new Date();
    const proxima = this.sumarDias(hoy, 15);

    const dialogRef = this.dialog.open(VacunaEditAddComponent, {
      width: '600px',
      data: {
        modo: 'crear',
        id_paciente: this.vacunasExternas?.[0]?.id_paciente ?? null,
        ultimaVacuna,
        fecha_vacuna: hoy,
        proxima_vacuna: proxima
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarDatos();
    });
  }

  // RESTO DEL CÓDIGO >>> NO SE MODIFICA EN NADA

  cambiarEstado(v: Vacuna): void {
    const dialogRef = this.dialog.open(AlertaComponent, {
      width: '350px',
      data: { mensaje: '¿Deseas cambiar el estado de esta vacuna?' },
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (!confirmado) return;

      const nuevoEstado = v.estado_vacuna === 1 ? 0 : 1;

      this.vacunaService
        .updateParcial(v.id_vacuna, { estado_vacuna: nuevoEstado })
        .subscribe((actualizada) => {
          const lista = [...this.vacunas()];
          const index = lista.findIndex(x => x.id_vacuna === actualizada.id_vacuna);
          lista[index] = actualizada;
          this.vacunas.set(lista);
          this.dataSource.set(lista);
        });
    });
  }

  eliminarVacuna(id: number): void {
    const dialogRef = this.dialog.open(AlertaComponent, {
      width: '350px',
      data: { mensaje: '¿Seguro que deseas eliminar esta vacuna?' },
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (!confirmado) return;

      this.vacunaService.delete(id).subscribe(() => {
        const lista = this.vacunas().filter(v => v.id_vacuna !== id);
        this.vacunas.set(lista);
        this.dataSource.set(lista);
      });
    });
  }

  editarVacuna(v: Vacuna): void {
    const dialogRef = this.dialog.open(VacunaEditAddComponent, {
      width: '600px',
      data: { vacuna: v }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarDatos();
    });
  }

  formatDate(f: Date | string): string {
    return this.datePipe.transform(f, 'dd/MM/yyyy') || '';
  }

  getClienteInfo(id_paciente: number): string {
    const paciente = this.pacientes.find(p => p.id_paciente === id_paciente);
    if (!paciente) return 'Sin cliente';

    const cliente = this.clientes.find(c => c.id_cliente === paciente.id_cliente);
    if (!cliente) return 'Sin cliente';

    return `${cliente.nombres} ${cliente.apellidos} | ${cliente.telefono}`;
  }

  getPacienteNombre(id: number): string {
    return this.pacientes.find(p => p.id_paciente === id)?.paciente || 'Desconocido';
  }

  getEspecie(id_paciente: number): string {
    return this.pacientes.find(p => p.id_paciente === id_paciente)?.especie || 'Desconocido';
  }

  getEstadoTexto(v: Vacuna): string {
    switch (v.estado_vacuna) {
      case 1: return 'Aplicada';
      case 3: return 'Vencida';
      default: return 'Pendiente';
    }
  }

  getEstadoColor(v: Vacuna): string {
    switch (v.estado_vacuna) {
      case 1: return '#800080';
      case 3: return '#9e9e9e';
      default: return '#dc9028';
    }
  }

  getTipoVacunaNombre(ids: number[]): string {
    return ids
      .map(id => this.tiposVacuna.find(t => t.id_tipo_vacuna === id)?.tipo_vacuna || 'Desconocido')
      .join(', ');
  }
}

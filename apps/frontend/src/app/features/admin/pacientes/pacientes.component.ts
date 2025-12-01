// pacientes.component.ts
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Paciente, PacienteService } from '../../../core/services/paciente.service';
import { AñadirPacienteComponent } from './añadir-paciente/añadir-paciente.component';
import { Cliente, ClienteService } from '../../../core/services/cliente.service';
import { AlertaComponent } from 'apps/frontend/src/app/shared/components/alerta/alerta.component';
import { MatCard, MatCardSubtitle, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatCard,
    MatCardSubtitle,
    MatCardActions,
    MatCardContent,
    MatCardTitle
  ],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PacientesComponent implements OnInit, OnChanges {

  @Output() pacienteSeleccionado = new EventEmitter<Paciente>();
  @Input() clienteSeleccionado?: Cliente;

  pacientes: Paciente[] = [];
  clientes: Cliente[] = [];
  filtro: string = '';

  displayedColumns: string[] = [
    'id_paciente',
    'paciente',
    'especie',
    'raza',
    'sexo',
    'cliente',
    'opciones'
  ];

  constructor(
    private pacienteService: PacienteService,
    private clienteService: ClienteService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarClientes();

    if (!this.clienteSeleccionado) {
      this.cargarPacientes();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteSeleccionado']) {
      this.clienteSeleccionado = this.clienteSeleccionado
        ? { ...this.clienteSeleccionado }
        : undefined;

      this.cargarPacientes();
    }
  }

  cargarPacientes(): void {
    this.pacienteService.getAll().subscribe({
      next: (data) => {
        if (this.clienteSeleccionado) {
          this.pacientes = data.filter(
            p => p.id_cliente === this.clienteSeleccionado!.id_cliente
          );
        } else {
          this.pacientes = data;
        }

        this.pacientes = [...this.pacientes];
      },
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  cargarClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => this.clientes = data,
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  eliminarPaciente(id: number): void {
    const ref = this.dialog.open(AlertaComponent, {
      width: '350px',
      data: { mensaje: '¿Seguro que deseas eliminar este paciente?' }
    });

    ref.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.pacienteService.delete(id).subscribe({
          next: () => this.cargarPacientes(),
          error: (err) => console.error('Error al eliminar:', err)
        });
      }
    });
  }

  abrirFormulario(paciente?: Paciente): void {
    const dialogRef = this.dialog.open(AñadirPacienteComponent, {
      width: '500px',
      data: paciente ? { ...paciente } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarPacientes();
      }
    });
  }

  getNombreCliente(idCliente: number): string {
    const cliente = this.clientes.find(c => c.id_cliente === idCliente);
    return cliente ? `${cliente.nombres} ${cliente.apellidos}` : '—';
  }

  get pacientesFiltrados(): Paciente[] {
    const filtroLower = this.filtro.toLowerCase();
    return this.pacientes.filter(p =>
      p.paciente.toLowerCase().includes(filtroLower) ||
      p.especie.toLowerCase().includes(filtroLower) ||
      p.raza.toLowerCase().includes(filtroLower)
    );
  }
}

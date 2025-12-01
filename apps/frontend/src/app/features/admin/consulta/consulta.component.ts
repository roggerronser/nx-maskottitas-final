import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PacienteService, Paciente } from '../../../core/services/paciente.service';
import { ClienteService, Cliente } from '../../../core/services/cliente.service';
import { ConsultaService, Consulta } from '../../../core/services/consulta.service';
import { SintomaService, Sintoma } from '../../../core/services/sintoma.service';

import { ExamenComponent } from './examen/examen.component';
import { ResultadoComponent } from './resultado/resultado.component';
import { ConsultaEditAddComponent } from './consulta-edit-add/consulta-edit-add.component';
import { AlertaComponent } from '../../../shared/components/alerta/alerta.component';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ExamenComponent,
    ResultadoComponent,
    AlertaComponent,
    ConsultaEditAddComponent,
  ],
  providers: [DatePipe],
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss'],
})
export class ConsultaComponent implements OnInit, OnChanges {

  @Input() consultasExternas?: Consulta[];

  private consultaService = inject(ConsultaService);
  private pacienteService = inject(PacienteService);
  private clienteService = inject(ClienteService);
  private sintomaService = inject(SintomaService);
  private datePipe = inject(DatePipe);
  private dialog = inject(MatDialog);

  consultas = signal<Consulta[]>([]);
  pacientes = signal<Paciente[]>([]);
  clientes = signal<Cliente[]>([]);
  sintomas = signal<Sintoma[]>([]);
  filtro = signal<string>('');
  expandedConsulta = signal<number | null>(null);

  columnsToDisplay = ['paciente', 'cliente', 'fecha', 'estado', 'acciones'];

  // ===========================================================
  // 🔥 ESPERA DATOS DEL PADRE — EXACTO COMO VACUNA COMPONENT
  // ===========================================================
  ngOnChanges(changes: SimpleChanges) {
    if (changes['consultasExternas'] && this.consultasExternas) {
      this.consultas.set(this.ordenar([...this.consultasExternas]));
    }
  }

  ngOnInit(): void {
    this.pacienteService.getAll().subscribe((p) => this.pacientes.set(p));
    this.clienteService.getAll().subscribe((c) => this.clientes.set(c));
    this.sintomaService.getAll().subscribe((s) => this.sintomas.set(s));

    // ⛔ YA NO CARGAR TODAS LAS CONSULTAS DE LA BD AQUÍ  
    // Solo si NO recibe consultasExternas
    if (!this.consultasExternas) {
      this.recargarConsultas();
    }
  }

  ordenar(lista: Consulta[]): Consulta[] {
    return lista.sort((a, b) => b.id_consulta! - a.id_consulta!);
  }

  trackByConsulta(index: number, item: Consulta) {
    return item.id_consulta;
  }

  pacienteNombre(id: number): string {
    return this.pacientes().find((p) => p.id_paciente === id)?.paciente || 'Desconocido';
  }

  clienteNombreTelefono(id_paciente: number): string {
    const paciente = this.pacientes().find((p) => p.id_paciente === id_paciente);
    if (!paciente) return 'Cliente desconocido';
    const cliente = this.clientes().find((c) => c.id_cliente === paciente.id_cliente);
    if (!cliente) return 'Cliente no registrado';
    return `${cliente.nombres} ${cliente.apellidos} (${cliente.telefono})`;
  }

  formatFecha(fecha: string): string {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy') || '';
  }

  sintomaNombre(ids: number[]): string {
    return ids
      .map((id) => this.sintomas().find((s) => s.id_sintoma === id)?.sintoma || 'Desconocido')
      .join(', ');
  }

  consultasFiltradas(): Consulta[] {
    const text = this.filtro().toLowerCase();
    return this.consultas().filter((c) => {
      const paciente = this.pacienteNombre(c.id_paciente).toLowerCase();
      return paciente.includes(text) || c.anamnesis.toLowerCase().includes(text);
    });
  }

  toggleExpand(c: Consulta) {
    this.expandedConsulta.set(
      this.expandedConsulta() === c.id_consulta ? null : c.id_consulta!
    );
  }

  isExpanded(c: Consulta): boolean {
    return this.expandedConsulta() === c.id_consulta;
  }

  toggleEstado(c: Consulta) {
    const dialogRef = this.dialog.open(AlertaComponent, {
      width: '350px',
      data: { mensaje: `¿Cambiar estado de esta consulta?` },
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (!confirm) return;

      const nuevoEstado = c.estado_consulta === 1 ? 0 : 1;

      const body = {
        estado_consulta: nuevoEstado,
        id_paciente: c.id_paciente,
        id_sintoma: c.id_sintoma,
      };

      this.consultaService.updatePartial(c.id_consulta!, body).subscribe((actualizada) => {
        const lista = [...this.consultas()];

        const index = lista.findIndex(x => x.id_consulta === actualizada.id_consulta);
        lista[index] = { ...lista[index], estado_consulta: actualizada.estado_consulta };

        this.consultas.set(this.ordenar(lista));
      });
    });
  }

  eliminarConsulta(id: number) {
    const dialogRef = this.dialog.open(AlertaComponent, {
      width: '350px',
      data: { mensaje: '¿Eliminar esta consulta?' },
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (!confirm) return;
      this.consultaService.delete(id).subscribe(() => {
        const lista = this.consultas().filter(c => c.id_consulta !== id);
        this.consultas.set(this.ordenar(lista));
      });
    });
  }

  abrirFormulario() {
    let ultima = null;

    if (this.consultasExternas?.length) {
      const lista = [...this.consultasExternas];
      lista.sort((a, b) => b.id_consulta! - a.id_consulta!);
      ultima = lista[0];
    }

    const dialogRef = this.dialog.open(ConsultaEditAddComponent, {
      width: '650px',
      data: {
        consulta: null,
        id_paciente: this.consultasExternas?.[0]?.id_paciente ?? null,
        ultimaConsulta: ultima
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (!this.consultasExternas) this.recargarConsultas();
    });
  }

  editarConsulta(c: Consulta) {
    const dialogRef = this.dialog.open(ConsultaEditAddComponent, {
      width: '650px',
      data: {
        consulta: c,
        id_paciente: c.id_paciente
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (!this.consultasExternas) this.recargarConsultas();
    });
  }

  private recargarConsultas() {
    this.consultaService.getAll().subscribe((lista: any[]) => {
      const normalizadas: Consulta[] = lista.map((item) => ({
        id_consulta: item.id_consulta,
        edad: item.edad,
        anamnesis: item.anamnesis,
        caracteristica: item.caracteristica,
        temperatura: Number(item.temperatura),
        fc: item.fc,
        fr: item.fr,
        hidratacion: item.hidratacion,
        mucosas: item.mucosas,
        tiempo_relleno_capilar: item.tiempo_relleno_capilar,
        spo2: Number(item.spo2),
        glucosa: Number(item.glucosa),
        presion_arterial: item.presion_arterial,
        otros: item.otros,
        fecha_consulta: item.fecha_consulta,
        estado_consulta: item.estado_consulta,
        id_paciente: item.id_paciente,
        id_sintoma: item.sintomas ? item.sintomas.map((s: any) => s.id_sintoma) : [],
      }));

      this.consultas.set(this.ordenar(normalizadas));
    });
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { VacunaComponent } from '../../vacuna/vacuna.component';
import { ConsultaComponent } from '../../consulta/consulta.component';
import { Cliente, ClienteService } from 'apps/frontend/src/app/core/services/cliente.service';
import { ConsultaService } from 'apps/frontend/src/app/core/services/consulta.service';
import { VacunaService, Vacuna } from 'apps/frontend/src/app/core/services/vacuna.service';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-detalle-paciente',
  standalone: true,
  imports: [
    CommonModule,
    VacunaComponent,
    ConsultaComponent,
    MatCardModule,
    MatTabsModule
  ],
  templateUrl: './detalle-paciente.component.html',
  styleUrls: ['./detalle-paciente.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default   // 🔥 IMPORTANTE
})
export class DetallePacienteComponent implements OnInit {

  @Input() paciente!: any;

  cliente?: Cliente;
  vacunas: Vacuna[] = [];
  consultas: any[] = [];

  private clienteService = inject(ClienteService);
  private vacunaService = inject(VacunaService);
  private consultaService = inject(ConsultaService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    if (this.paciente) {
      this.cargarDatos();
    }
  }

  cargarDatos(): void {

    this.clienteService.getAll().subscribe(clientes => {
      this.cliente = clientes.find(c => c.id_cliente === this.paciente.id_cliente);
      this.cdr.detectChanges();
    });

    this.vacunaService.getAll().subscribe(vs => {
      this.vacunas = vs.filter(v => Number(v.id_paciente) === Number(this.paciente.id_paciente));
      this.vacunas = [...this.vacunas];
      this.cdr.detectChanges();
    });

    this.consultaService.getAll().subscribe(cs => {
      this.consultas = cs.filter(c => Number(c.id_paciente) === Number(this.paciente.id_paciente));
      this.consultas = [...this.consultas];
      this.cdr.detectChanges();
    });

  }
}

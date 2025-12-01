import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

import { VacunaService, Vacuna } from 'apps/frontend/src/app/core/services/vacuna.service';
import { PacienteService, Paciente } from 'apps/frontend/src/app/core/services/paciente.service';
import { ClienteService, Cliente } from 'apps/frontend/src/app/core/services/cliente.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {

  private vacunaService = inject(VacunaService);
  private pacienteService = inject(PacienteService);
  private clienteService = inject(ClienteService);

  vacunas = signal<Vacuna[]>([]);
  pacientes = signal<Paciente[]>([]);
  clientes = signal<Cliente[]>([]);

  ngOnInit() {
    this.vacunaService.getAll().subscribe(v => this.vacunas.set(v));
    this.pacienteService.getAll().subscribe(p => this.pacientes.set(p));
    this.clienteService.getAll().subscribe(c => this.clientes.set(c));
  }

  // 🔥 VACUNAS PRÓXIMAS A VENCER – dentro de 5 días
  vacunasProximas = computed(() => {
    const hoy = new Date();
    const limiteDias = 5;

    return this.vacunas()
      .filter(v => {
        const proxima = new Date(v.proxima_vacuna);
        const diffMs = proxima.getTime() - hoy.getTime();
        const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return (
          v.estado_vacuna !== 3 && // no vencida
          diffDias >= 0 &&         // no pasada
          diffDias <= limiteDias   // dentro de 5 días
        );
      })
      .sort((a, b) => new Date(a.proxima_vacuna).getTime() - new Date(b.proxima_vacuna).getTime());
  });

  // 🔥 VACUNAS YA VENCIDAS
  vacunasVencidas = computed(() => {
    const hoy = new Date();

    return this.vacunas()
      .filter(v => new Date(v.proxima_vacuna).getTime() < hoy.getTime()) // ya venció
      .sort((a, b) => new Date(b.proxima_vacuna).getTime() - new Date(a.proxima_vacuna).getTime());
  });

  getPacienteNombre(id: number): string {
    const p = this.pacientes().find(x => x.id_paciente === id);
    return p ? p.paciente : '—';
  }

  getClienteNombre(id_paciente: number): string {
    const p = this.pacientes().find(x => x.id_paciente === id_paciente);
    const c = this.clientes().find(x => x.id_cliente === p?.id_cliente);
    return c ? `${c.nombres} ${c.apellidos}` : '—';
  }
}

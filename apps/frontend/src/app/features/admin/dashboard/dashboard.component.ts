import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

import { InicioComponent } from '../inicio/inicio.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { PacientesComponent } from '../pacientes/pacientes.component';
import { DetallePacienteComponent } from '../pacientes/detalle-paciente/detalle-paciente.component';
import { DetalleClienteComponent } from '../cliente/detalle-cliente/detalle-cliente.component';
import { ClienteComponent } from '../cliente/cliente.component';
import { Paciente } from '../../../core/services/paciente.service';
import { Cliente } from '../../../core/services/cliente.service';
import { PrediccionComponent } from '../prediccion/prediccion.component';
import { ConsultaComponent } from '../consulta/consulta.component';
import { VacunaComponent } from '../vacuna/vacuna.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    InicioComponent,
    PerfilComponent,
    PacientesComponent,
    DetallePacienteComponent,
    DetalleClienteComponent,
    ClienteComponent,
    VacunaComponent,
    ConsultaComponent,
    PrediccionComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,

})
export class DashboardComponent {
  // Estado general
  sidebarOpen = signal(true);
  currentView = signal<'inicio' | 'clientes' | 'perfil' | 'pacientes' | 'detalle' |'detalleCliente' | 'vacuna'| 'consulta'| 'prediccion'>('inicio');
  pacienteActual = signal<Paciente | null>(null);
  clienteActual = signal<Cliente | null>(null);

  isMobile = signal(false);

  constructor(private auth: AuthService) {
    this.checkMobileView();
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  setView(view: 'inicio' | 'clientes' | 'perfil' | 'pacientes' | 'detalle'|'detalleCliente'| 'vacuna'| 'consulta'|'prediccion') {
    this.currentView.set(view);

    // En móvil, cerrar el menú al navegar
    if (this.isMobile() && this.sidebarOpen()) {
      this.sidebarOpen.set(false);
    }
  }

  mostrarDetalle(paciente: Paciente) {
    this.pacienteActual.set(paciente);
    this.currentView.set('detalle');
  }
  
  mostrarDetalleCliente(cliente: Cliente){
    this.clienteActual.set(cliente);
    this.currentView.set('detalleCliente')
  }

  logout() {
    this.auth.logout();
  }

  checkMobileView() {
    const isNowMobile = window.innerWidth <= 768;
    this.isMobile.set(isNowMobile);

    if (isNowMobile && this.sidebarOpen()) {
      this.sidebarOpen.set(false);
    } else if (!isNowMobile && !this.sidebarOpen()) {
      this.sidebarOpen.set(true);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobileView();
  }

  // Para el HTML
  isMobileView() {
    return this.isMobile();
  }
}

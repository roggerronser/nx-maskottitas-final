import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { PacientesComponent } from '../../pacientes/pacientes.component';
import { Cliente } from 'apps/frontend/src/app/core/services/cliente.service';
import { AñadirPacienteComponent } from '../../pacientes/añadir-paciente/añadir-paciente.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-detalle-cliente',
  standalone: true,
  imports: [CommonModule, PacientesComponent,MatIcon],
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalleClienteComponent implements OnChanges {
  @Input() cliente: Cliente | null = null;
  dialog: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente']) {
      this.cliente = this.cliente ? { ...this.cliente } : null;
      this.cdr.markForCheck();
    }
  }
  nuevoPaciente() {
    this.dialog.open(AñadirPacienteComponent, {
      width: '500px',
      data: { id_cliente: this.cliente!.id_cliente }
    });
  }
}

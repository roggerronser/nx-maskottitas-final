import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente } from '../../../core/services/cliente.service';
import { AddClienteDialogComponent } from './add-cliente-dialog/add-cliente-dialog.component';
import { AlertaComponent } from '../../../shared/components/alerta/alerta.component';
import { DetalleClienteComponent } from './detalle-cliente/detalle-cliente.component';
import { MatCard, MatCardSubtitle, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    AddClienteDialogComponent,
    AlertaComponent,
    DetalleClienteComponent,
    MatButton,
    MatCard,
    MatCardSubtitle,
    MatCardTitle,
    MatCardContent,
    MatCardActions
  ],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private dialog = inject(MatDialog);

  displayedColumns = ['id_cliente', 'nombres', 'apellidos', 'direccion', 'telefono', 'acciones'];

  clientes = signal<Cliente[]>([]);
  filtro = signal<string>('');
  clienteSeleccionado = signal<Cliente | null>(null);

  clientesFiltrados = computed(() => {
    const texto = this.filtro().toLowerCase();
    return this.clientes().filter(c =>
      c.nombres.toLowerCase().includes(texto) ||
      c.apellidos.toLowerCase().includes(texto)
    );
  });

  ngOnInit(): void {
    this.recargar();
  }

  private recargar() {
    this.clienteService.getAll().subscribe(data => this.clientes.set(data));
  }
  
  abrirDialogAgregar(): void {
    const ref = this.dialog.open(AddClienteDialogComponent, {
      width: '400px',
      data: null,
    });
    ref.afterClosed().subscribe((nuevo: Cliente) => {
      if (nuevo) {
        this.clienteService.add(nuevo).subscribe(() => this.recargar());
      }
    });
  }
  
  editar(cliente: Cliente): void {
    const ref = this.dialog.open(AddClienteDialogComponent, {
      width: '400px',
      data: cliente,
    });
    ref.afterClosed().subscribe((actualizado: Cliente) => {
      if (actualizado) {
        this.clienteService.update(actualizado).subscribe(() => this.recargar());
      }
    });
  }
  
  eliminar(id: number): void {
    const ref = this.dialog.open(AlertaComponent, {
      width: '350px',
      data: { mensaje: '¿Seguro que deseas eliminar este cliente?' },
    });
  
    ref.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.clienteService.delete(id).subscribe(() => this.recargar());
      }
    });
  }
  

  verDetalle(cliente: Cliente): void {
    this.clienteSeleccionado.set(cliente);
  }

  cerrarDetalle(): void {
    this.clienteSeleccionado.set(null);
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Cliente } from 'apps/frontend/src/app/core/services/cliente.service';
import { AlertaComponent } from 'apps/frontend/src/app/shared/components/alerta/alerta.component';

@Component({
  selector: 'app-add-cliente-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    AlertaComponent,
  ],
  templateUrl: './add-cliente-dialog.component.html',
  styleUrls: ['./add-cliente-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddClienteDialogComponent implements OnInit {
  private dialog = inject(MatDialog);
  private ref = inject(MatDialogRef<AddClienteDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Cliente | null) {}

  // ✅ Signal con los datos del cliente
  cliente = signal<Omit<Cliente, 'id_cliente'>>({
    nombres: '',
    apellidos: '',
    direccion: '',
    telefono: 0,
  });
  

  titulo = signal('Agregar nuevo cliente');

  ngOnInit() {
    if (this.data) {
      this.cliente.set({ ...this.data });
      this.titulo.set('Editar cliente');
    }
  }
  

  actualizarCampo(campo: keyof Cliente, event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.cliente.update(c => ({ ...c, [campo]: campo === 'telefono' ? +valor : valor }));
  }

  cancelar() {
    this.ref.close();
  }

  guardar() {
    const c = this.cliente();
    if (!c.nombres || !c.apellidos || !c.direccion || !c.telefono) {
      this.dialog.open(AlertaComponent, {
        data: { mensaje: '⚠️ Por favor, completa todos los campos antes de guardar.' },
        width: '350px',
      });
      return;
    }
  
    const mensaje = this.data ? '¿Deseas guardar los cambios del cliente?' : '¿Deseas agregar este cliente?';
    const confirmDialog = this.dialog.open(AlertaComponent, { data: { mensaje }, width: '350px' });
  
    confirmDialog.afterClosed().subscribe(confirmado => {
      if (confirmado) this.ref.close(this.cliente());
    });
  }
  
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-alerta',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertaComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}

  cancelar(): void {
    this.dialogRef.close(false);
  }

  confirmar(): void {
    this.dialogRef.close(true);
  }
}

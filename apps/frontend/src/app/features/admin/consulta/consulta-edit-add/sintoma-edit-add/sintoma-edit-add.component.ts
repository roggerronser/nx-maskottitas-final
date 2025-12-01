import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Sintoma, SintomaService } from 'apps/frontend/src/app/core/services/sintoma.service';

@Component({
  selector: 'app-sintoma-edit-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './sintoma-edit-add.component.html',
  styleUrls: ['./sintoma-edit-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SintomaEditAddComponent {
  
  private dialogRef = inject(MatDialogRef<SintomaEditAddComponent>);
  private fb = inject(FormBuilder);
  private sintomaService = inject(SintomaService);

  form: FormGroup;
  modoEditar = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Sintoma | null) {
    this.modoEditar = !!data;

    this.form = this.fb.group({
      id_sintoma: [data?.id_sintoma || null],
      sintoma: [data?.sintoma || '', Validators.required]
    });
  }

  guardar(): void {
    if (this.form.invalid) return;

    const value = this.form.value;

    if (this.modoEditar && value.id_sintoma) {
      this.sintomaService
        .update(value.id_sintoma, { sintoma: value.sintoma })
        .subscribe(() => this.dialogRef.close(true));
    } else {
      this.sintomaService
        .add({ sintoma: value.sintoma })
        .subscribe(() => this.dialogRef.close(true));
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}

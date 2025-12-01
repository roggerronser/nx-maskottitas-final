import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Admin, AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilComponent {
  perfilForm!: FormGroup;
  admin!: Admin;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // ✅ Obtener el admin logueado desde AuthService
    const current = this.authService.getCurrentAdmin();

    if (!current) {
      alert('No hay administrador logueado');
      return;
    }

    this.admin = current;

    // ✅ Inicializar formulario con los datos del admin actual
    this.perfilForm = this.fb.group({
      nombre: [this.admin.nombre, Validators.required],
      apellido: [this.admin.apellido, Validators.required],
      telefono: [
        this.admin.telefono,
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      username: [this.admin.username, Validators.required],

      // manejo de contraseñas
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.perfilForm.valid) {
      const { oldPassword, newPassword, confirmPassword, ...rest } = this.perfilForm.value;

      // validar contraseña actual
      if (oldPassword !== this.admin.password) {
        alert('La contraseña anterior no coincide');
        return;
      }

      // validar confirmación
      if (newPassword !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      // ✅ Actualizar datos del admin logueado
      this.adminService.updateAdmin(this.admin.id_admin, {
        ...rest,
        password: newPassword,
      });

      // ✅ Actualizar también en localStorage
      const updatedAdmin = {
        ...this.admin,
        ...rest,
        password: newPassword,
      };
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));

      alert('Datos actualizados correctamente');
    }
  }
}

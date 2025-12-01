import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Resultado, ResultadoService } from 'apps/frontend/src/app/core/services/resultado.service';
import { Examen, ExamenService } from 'apps/frontend/src/app/core/services/examen.service';
import { AlertaComponent } from 'apps/frontend/src/app/shared/components/alerta/alerta.component';
import { ResultadoEditAddComponent } from './resultado-edit-add/resultado-edit-add.component';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultadoComponent implements OnInit {
  @Input() idConsulta!: number;
  resultados = signal<Resultado[]>([]);

  constructor(
    private resultadoService: ResultadoService,
    private examenService: ExamenService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarResultados();
  }

  /** 🔄 Cargar resultados por consulta */
  private cargarResultados(): void {
    this.examenService.getByConsulta(this.idConsulta).subscribe(examenes => {
      const idsExamenes = examenes.map(e => e.id_examen);

      this.resultadoService.getAll().subscribe(resultados => {
        this.resultados.set(
          resultados.filter(r => idsExamenes.includes(r.id_examen))
        );
      });
    });
  }

  /** ➕ Agregar */
  agregar(): void {
    this.examenService.getByConsulta(this.idConsulta).subscribe(examenes => {
      const dialogRef = this.dialog.open(ResultadoEditAddComponent, {
        width: '500px',
        data: { id_consulta: this.idConsulta, examenes },
      });

      dialogRef.afterClosed().subscribe((nuevoResultado) => {
        if (nuevoResultado) {
          this.resultadoService.create(nuevoResultado).subscribe(() => {
            this.cargarResultados();
          });
        }
      });
    });
  }

  /** ✏ Editar */
  editar(resultado: Resultado): void {
    this.examenService.getByConsulta(this.idConsulta).subscribe(examenes => {
      const dialogRef = this.dialog.open(ResultadoEditAddComponent, {
        width: '500px',
        data: { resultado, examenes },
      });

      dialogRef.afterClosed().subscribe((resultadoEditado) => {
        if (resultadoEditado) {
          this.resultadoService
            .update(resultado.id_resultado, resultadoEditado)
            .subscribe(() => this.cargarResultados());
        }
      });
    });
  }

  /** 🗑 Eliminar */
  eliminar(id: number): void {
    const confirmRef = this.dialog.open(AlertaComponent, {
      data: {
        tipo: 'confirmacion',
        mensaje: '¿Seguro que deseas eliminar este resultado?',
      },
    });

    confirmRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        this.resultadoService.delete(id).subscribe(() => {
          this.resultados.set(this.resultados().filter(r => r.id_resultado !== id));
        });
      }
    });
  }
}

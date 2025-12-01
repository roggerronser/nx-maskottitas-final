import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { Sintoma, SintomaService } from '../../../core/services/sintoma.service';

@Component({
  selector: 'app-prediccion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    MatDividerModule,
  ],
  templateUrl: './prediccion.component.html',
  styleUrls: ['./prediccion.component.scss'],
})
export class PrediccionComponent implements OnInit {
  sintomas: Sintoma[] = [];
  seleccionados: number[] = [];

  resultadoPrincipal: string | null = null;
  alternativos: { diagnostico: string; probabilidad: number }[] = [];

  cargando = false;
  error: string | null = null;

  constructor(private sintomaService: SintomaService) {}

  ngOnInit(): void {
    console.log('📌 Cargando síntomas desde backend...');
    this.sintomaService.getAll().subscribe({
      next: (data) => {
        console.log('✔ Síntomas recibidos:', data);
        this.sintomas = data;
      },
      error: (err) => {
        console.error('❌ Error al cargar síntomas:', err);
        this.error = 'No se pudieron cargar los síntomas.';
      },
    });
  }

  predecir(): void {
    this.resultadoPrincipal = null;
    this.alternativos = [];
    this.error = null;
    this.cargando = true;

    console.log('📤 Enviando ids de síntomas:', this.seleccionados);

    fetch('http://localhost:3000/api/ml/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_sintoma: this.seleccionados }),
    })
      .then(async (res) => {
        console.log('📥 Status respuesta:', res.status);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Error en la predicción');
        }
        return res.json();
      })
      .then((data) => {
        console.log('📊 Predicción recibida:', data);
        this.resultadoPrincipal = data.principal;
        this.alternativos = data.alternativos || [];
      })
      .catch((err) => {
        console.error('❌ Error en predecir():', err);
        this.error = 'Ocurrió un error al predecir la enfermedad.';
      })
      .finally(() => {
        this.cargando = false;
      });
  }
}

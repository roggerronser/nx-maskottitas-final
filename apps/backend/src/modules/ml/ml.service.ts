import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Este servicio "se entrena" leyendo la BD:
 * - Consulta.sintomas (relación muchos a muchos)
 * - Consulta.examenes.resultados.diagnt_definitivo
 *
 * Construye un mapa:
 *   enfermedad -> conjunto de ids de síntomas que suelen aparecer con esa enfermedad
 */
@Injectable()
export class MlService {
  predecir(sintomas: number[]) {
      throw new Error('Method not implemented.');
  }
  entrenarModelo() {
      throw new Error('Method not implemented.');
  }
  // enfermedad -> set de id_sintoma
  private diseaseMap = new Map<string, Set<number>>();

  constructor(private readonly prisma: PrismaService) {
    // Entrenamos automáticamente al iniciar
    this.retrain().catch((err) => {
      console.error('❌ Error entrenando modelo ML al iniciar:', err);
    });
  }

  /**
   * Lee TODAS las consultas de la BD con sus síntomas y resultados
   * y reconstruye el mapa enfermedad -> síntomas.
   */
  async retrain(): Promise<void> {
    try {
      const consultas = await this.prisma.consulta.findMany({
        include: {
          sintomas: true, // ← array de Sintoma
          examenes: {
            include: {
              resultados: true, // ← array de Resultado
            },
          },
        },
      });

      const nuevoMapa = new Map<string, Set<number>>();

      for (const consulta of consultas) {
        const symptomIds = consulta.sintomas.map((s) => s.id_sintoma);

        if (!symptomIds.length) continue;

        for (const examen of consulta.examenes) {
          for (const resultado of examen.resultados) {
            const diag = resultado.diagnt_definitivo?.trim();
            if (!diag) continue;

            if (!nuevoMapa.has(diag)) {
              nuevoMapa.set(diag, new Set<number>());
            }

            const set = nuevoMapa.get(diag)!;
            symptomIds.forEach((id) => set.add(id));
          }
        }
      }

      this.diseaseMap = nuevoMapa;
      console.log('✅ Modelo ML entrenado. Enfermedades:', this.diseaseMap.size);
    } catch (error) {
      console.error('❌ Error en retrain():', error);
      throw new InternalServerErrorException('Error entrenando modelo de predicción');
    }
  }

  /**
   * Predice la enfermedad más probable según:
   * - cuántos síntomas seleccionados coinciden con los síntomas históricos de cada enfermedad
   */
  predict(selectedSymptoms: number[]) {
    if (!this.diseaseMap || this.diseaseMap.size === 0) {
      throw new InternalServerErrorException('No hay datos de entrenamiento (sin resultados en BD)');
    }

    const resultados: { diagnostico: string; matches: number; score: number }[] = [];

    for (const [diagnostico, symSet] of this.diseaseMap.entries()) {
      let matches = 0;
      for (const id of selectedSymptoms) {
        if (symSet.has(id)) matches++;
      }
      if (matches === 0) continue;

      const score = matches / selectedSymptoms.length; // % de síntomas que coinciden
      resultados.push({ diagnostico, matches, score });
    }

    if (!resultados.length) {
      return {
        principal: null,
        alternativos: [] as { diagnostico: string; probabilidad: number }[],
      };
    }

    // Ordenar: primero por score, luego por cantidad de coincidencias
    resultados.sort(
      (a, b) => b.score - a.score || b.matches - a.matches,
    );

    const totalScore = resultados.reduce((acc, r) => acc + r.score, 0);

    const conProb = resultados.map((r) => ({
      diagnostico: r.diagnostico,
      probabilidad: totalScore > 0 ? r.score / totalScore : 0,
    }));

    return {
      principal: conProb[0].diagnostico,
      alternativos: conProb.slice(1),
    };
  }
}

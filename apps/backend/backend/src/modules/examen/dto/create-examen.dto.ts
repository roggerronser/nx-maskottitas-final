// src/modules/examen/dto/create-examen.dto.ts
import { IsInt, IsString } from 'class-validator';

export class CreateExamenDto {
  @IsString()
  tipo_examen: string;

  @IsString()
  diagnt_presuntivo: string;

  @IsInt()
  id_consulta: number;
}

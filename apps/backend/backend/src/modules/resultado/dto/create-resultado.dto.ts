import { IsInt, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateResultadoDto {
  @IsString()
  @IsNotEmpty()
  diagnt_definitivo: string;

  @IsString()
  @IsNotEmpty()
  tratamiento: string;

  @IsDateString()
  prox_cita: string;

  @IsString()
  observaciones: string;

  @IsInt()
  id_examen: number;
}

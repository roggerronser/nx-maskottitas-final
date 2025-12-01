import { IsInt, IsString, IsDateString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateVacunaDto {
  @IsString()
  aplicacion_vacuna: string;

  @IsInt()
  estado_vacuna: number;

  @IsString()
  temperatura_vacuna: string;

  @IsString()
  fc_vacuna: string;

  @IsString()
  fr_vacuna: string;

  @IsString()
  mucosa_vacuna: string;

  @IsDateString()
  fecha_vacuna: Date;

  @IsDateString()
  proxima_vacuna: Date;

  @IsInt()
  id_paciente: number;

  @IsArray()
  id_tipo_vacuna: number[];
}

export class UpdateVacunaDto extends CreateVacunaDto {
  @IsInt()
  id_vacuna: number;
}

import { IsInt, IsString, IsDateString, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateConsultaDto {
  @IsInt()
  edad: number;

  @IsString()
  anamnesis: string;

  @IsString()
  caracteristica: string;

  @IsNumber()
  temperatura: number;

  @IsInt()
  fc: number;

  @IsInt()
  fr: number;

  @IsString()
  hidratacion: string;

  @IsString()
  mucosas: string;

  @IsString()
  tiempo_relleno_capilar: string;

  @IsNumber()
  spo2: number;

  @IsNumber()
  glucosa: number;

  @IsString()
  presion_arterial: string;

  @IsString()
  otros: string;

  @IsDateString()
  fecha_consulta: string;

  @IsInt()
  estado_consulta: number;

  @IsInt()
  id_paciente: number;

  @IsArray()
  @ArrayNotEmpty()
  id_sintoma: number[];
}

import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePacienteDto {
  @IsString()
  @IsNotEmpty()
  paciente: string;

  @IsString()
  @IsNotEmpty()
  especie: string;

  @IsString()
  @IsNotEmpty()
  raza: string;

  @IsString()
  @IsNotEmpty()
  sexo: string;

  @IsInt()
  @IsNotEmpty()
  id_cliente: number;
}

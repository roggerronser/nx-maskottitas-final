// apps/backend/src/modules/cliente/dto/create-cliente.dto.ts
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsInt()
  @IsNotEmpty()
  telefono: number;
}

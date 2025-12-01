import { IsInt, IsString, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TipoVacunaItemDTO {
  @IsInt()
  id_tipo_vacuna: number;
}

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
  fecha_vacuna: string;

  @IsDateString()
  proxima_vacuna: string;

  @IsInt()
  id_paciente: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TipoVacunaItemDTO)
  tipos_vacuna: TipoVacunaItemDTO[];
}

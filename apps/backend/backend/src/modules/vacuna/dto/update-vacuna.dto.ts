import { PartialType } from '@nestjs/mapped-types';
import { CreateVacunaDto } from './create-vacuna.dto';
import { IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class TipoVacunaItemDTO {
  id_tipo_vacuna: number;
}

export class UpdateVacunaDto extends PartialType(CreateVacunaDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TipoVacunaItemDTO)
  tipos_vacuna?: TipoVacunaItemDTO[];
}

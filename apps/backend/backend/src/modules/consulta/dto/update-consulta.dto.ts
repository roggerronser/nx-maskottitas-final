import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultaDto } from './create-consulta.dto';
import { IsOptional, IsArray, IsInt } from 'class-validator';

export class UpdateConsultaDto extends PartialType(CreateConsultaDto) {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  id_sintoma?: number[];
}

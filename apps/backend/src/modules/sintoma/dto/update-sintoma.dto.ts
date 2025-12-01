import { PartialType } from '@nestjs/mapped-types';
import { CreateSintomaDto } from './create-sintoma.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSintomaDto extends PartialType(CreateSintomaDto) {
  @IsOptional()
  @IsString()
  sintoma?: string;
}

import { IsString } from 'class-validator';

export class CreateSintomaDto {
  @IsString()
  sintoma: string;
}

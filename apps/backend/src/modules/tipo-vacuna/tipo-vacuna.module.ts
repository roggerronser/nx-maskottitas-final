import { Module } from '@nestjs/common';
import { TipoVacunaService } from './tipo-vacuna.service';
import { TipoVacunaController } from './tipo-vacuna.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TipoVacunaController],
  providers: [TipoVacunaService, PrismaService], 
})
export class TipoVacunaModule {}

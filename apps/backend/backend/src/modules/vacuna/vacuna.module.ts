import { Module } from '@nestjs/common';
import { VacunaService } from './vacuna.service';
import { VacunaController } from './vacuna.controller';
import { PrismaService } from '../../prisma/prisma.service';


@Module({
  controllers: [VacunaController],
  providers: [VacunaService, PrismaService],
  exports: [VacunaService],
})
export class VacunaModule {}

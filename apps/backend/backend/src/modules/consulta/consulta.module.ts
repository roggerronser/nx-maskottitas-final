// src/modules/consulta/consulta.module.ts
import { Module } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaController } from './consulta.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [ConsultaService, PrismaService],
  controllers: [ConsultaController],
})
export class ConsultaModule {}

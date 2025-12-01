import { Module } from '@nestjs/common';
import { ResultadoService } from './resultado.service';
import { ResultadoController } from './resultado.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [ResultadoService, PrismaService],
  controllers: [ResultadoController],
})
export class ResultadoModule {}

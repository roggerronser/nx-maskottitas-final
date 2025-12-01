import { Module } from '@nestjs/common';
import { ExamenService } from './examen.service';
import { ExamenController } from './examen.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ExamenController], // solo controladores aquí
  providers: [ExamenService, PrismaService], // PrismaService como provider
})
export class ExamenModule {}

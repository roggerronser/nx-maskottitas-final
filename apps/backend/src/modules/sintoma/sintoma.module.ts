import { Module } from '@nestjs/common';
import { SintomaService } from './sintoma.service';
import { SintomaController } from './sintoma.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [SintomaService, PrismaService],
  controllers: [SintomaController],
})
export class SintomaModule {}

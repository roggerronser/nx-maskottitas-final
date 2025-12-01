import { Module } from '@nestjs/common';
import { MlController } from './ml.controller';
import { MlService } from './ml.service';
import { PrismaService } from '../../prisma/prisma.service';


@Module({
  controllers: [MlController],
  providers: [MlService, PrismaService],
})
export class MlModule {}

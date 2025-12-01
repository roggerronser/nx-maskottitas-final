import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { PrismaService } from '../../prisma/prisma.service';
import { join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: join(process.cwd(), 'apps/backend/uploads/pdf'),
    }),
  ],
  controllers: [PdfController],
  providers: [PdfService, PrismaService],
})
export class PdfModule {}

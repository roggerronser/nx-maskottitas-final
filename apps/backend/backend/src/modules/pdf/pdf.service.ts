import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePdfDto } from './dto/create-pdf.dto';

@Injectable()
export class PdfService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePdfDto) {
    return this.prisma.pdf.create({
      data: {
        pdf: data.pdf,
        id_examen: data.id_examen
      }
    });
  }

  findByExam(id_examen: number) {
    return this.prisma.pdf.findMany({
      where: { id_examen }
    });
  }

  async delete(id_pdf: number) {
    const pdf = await this.prisma.pdf.findUnique({
      where: { id_pdf }
    });

    await this.prisma.pdf.delete({
      where: { id_pdf }
    });

    return pdf;
  }
}

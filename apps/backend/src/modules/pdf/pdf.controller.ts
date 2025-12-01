import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Res,
  Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { Response } from 'express';
import * as fs from 'fs';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  // ===============================
  //  SUBIR ARCHIVO PDF
  // ===============================
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(
            process.cwd(),
            'apps',
            'backend',
            'uploads',
            'pdf'
          );

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Guardar nombre original + timestamp
          const safeName = file.originalname.replace(/\s+/g, '_');
          const timestamp = Date.now();
          const finalName = `${timestamp}_${safeName}`;
          cb(null, finalName);
        }
      })
    })
  )
  uploadPdf(@UploadedFile() file: Express.Multer.File) {
    // IMPORTANTE: devolver el nombre final correcto
    return { filename: file.filename };
  }

  // ===============================
  //  GUARDAR REGISTRO EN BD
  // ===============================
  @Post()
  create(@Body() data: { pdf: string; id_examen: number }) {
    return this.pdfService.create(data);
  }

  // ===============================
  //  LISTAR POR EXAMEN
  // ===============================
  @Get('examen/:id')
  findByExam(@Param('id') id: string) {
    return this.pdfService.findByExam(Number(id));
  }

  // ===============================
  //  VER / DESCARGAR PDF
  // ===============================
  @Get(':filename')
  verPdf(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(
      process.cwd(),
      'apps',
      'backend',
      'uploads',
      'pdf',
      filename
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    return res.sendFile(filePath);
  }

  // ===============================
  //  ELIMINAR PDF
  // ===============================
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const pdf = await this.pdfService.delete(Number(id));

    const filePath = join(
      process.cwd(),
      'apps',
      'backend',
      'uploads',
      'pdf',
      pdf.pdf
    );

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return { deleted: true };
  }
}

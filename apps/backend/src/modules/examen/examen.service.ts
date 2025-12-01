// src/modules/examen/examen.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Examen } from '@prisma/client';
import { CreateExamenDto } from './dto/create-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';

@Injectable()
export class ExamenService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Examen[]> {
    return this.prisma.examen.findMany();
  }

  async getById(id: number): Promise<Examen> {
    const examen = await this.prisma.examen.findUnique({
      where: { id_examen: id },
    });

    if (!examen) {
      throw new NotFoundException(`Examen con id ${id} no encontrado`);
    }

    return examen;
  }

  async create(data: CreateExamenDto): Promise<Examen> {
    return this.prisma.examen.create({
      data: {
        tipo_examen: data.tipo_examen,
        diagnt_presuntivo: data.diagnt_presuntivo,
        id_consulta: data.id_consulta,
      },
    });
  }

  async update(id: number, data: UpdateExamenDto): Promise<Examen> {
    await this.getById(id); // valida existencia

    return this.prisma.examen.update({
      where: { id_examen: id },
      data: {
        ...data,
      },
    });
  }

  async delete(id: number): Promise<Examen> {
    await this.getById(id); // valida existencia
    return this.prisma.examen.delete({ where: { id_examen: id } });
  }

  async getByConsulta(id_consulta: number): Promise<Examen[]> {
    return this.prisma.examen.findMany({ where: { id_consulta } });
  }
}

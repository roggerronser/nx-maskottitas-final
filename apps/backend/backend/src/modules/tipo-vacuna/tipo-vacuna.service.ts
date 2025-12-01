import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TipoVacuna } from '@prisma/client';
import { CreateTipoVacunaDto } from './dto/create-tipo-vacuna.dto';
import { UpdateTipoVacunaDto } from './dto/update-tipo-vacuna.dto';

@Injectable()
export class TipoVacunaService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<TipoVacuna[]> {
    return this.prisma.tipoVacuna.findMany();
  }

  async getById(id: number): Promise<TipoVacuna> {
    const tipo = await this.prisma.tipoVacuna.findUnique({
      where: { id_tipo_vacuna: id },
    });
    if (!tipo) throw new NotFoundException(`TipoVacuna con id ${id} no encontrada`);
    return tipo;
  }

  async create(data: CreateTipoVacunaDto): Promise<TipoVacuna> {
    return this.prisma.tipoVacuna.create({
      data: {
        tipo_vacuna: data.tipo_vacuna,
      },
    });
  }

  async update(id: number, data: UpdateTipoVacunaDto): Promise<TipoVacuna> {
    await this.getById(id);
    return this.prisma.tipoVacuna.update({
      where: { id_tipo_vacuna: id },
      data,
    });
  }

  async delete(id: number): Promise<TipoVacuna> {
    await this.getById(id);
    return this.prisma.tipoVacuna.delete({
      where: { id_tipo_vacuna: id },
    });
  }
}

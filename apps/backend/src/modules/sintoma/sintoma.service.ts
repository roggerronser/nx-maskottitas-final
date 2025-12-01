import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Sintoma } from '@prisma/client';
import { CreateSintomaDto } from './dto/create-sintoma.dto';
import { UpdateSintomaDto } from './dto/update-sintoma.dto';

@Injectable()
export class SintomaService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Sintoma[]> {
    return this.prisma.sintoma.findMany();
  }

  async getById(id: number): Promise<Sintoma> {
    const sintoma = await this.prisma.sintoma.findUnique({
      where: { id_sintoma: id },
    });

    if (!sintoma) {
      throw new NotFoundException(`Síntoma con id ${id} no encontrado`);
    }

    return sintoma;
  }

  async create(data: CreateSintomaDto): Promise<Sintoma> {
    return this.prisma.sintoma.create({ data });
  }

  async update(id: number, data: UpdateSintomaDto): Promise<Sintoma> {
    await this.getById(id);

    return this.prisma.sintoma.update({
      where: { id_sintoma: id },
      data,
    });
  }

  async delete(id: number): Promise<Sintoma> {
    await this.getById(id);

    return this.prisma.sintoma.delete({
      where: { id_sintoma: id },
    });
  }
}

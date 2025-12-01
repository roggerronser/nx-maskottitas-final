import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Resultado } from '@prisma/client';
import { CreateResultadoDto } from './dto/create-resultado.dto';
import { UpdateResultadoDto } from './dto/update-resultado.dto';

@Injectable()
export class ResultadoService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Resultado[]> {
    return this.prisma.resultado.findMany();
  }

  async getById(id: number): Promise<Resultado> {
    const resultado = await this.prisma.resultado.findUnique({
      where: { id_resultado: id },
    });

    if (!resultado)
      throw new NotFoundException(`Resultado con id ${id} no encontrado`);

    return resultado;
  }

  async create(data: CreateResultadoDto): Promise<Resultado> {
    return this.prisma.resultado.create({ data });
  }

  async update(id: number, data: UpdateResultadoDto): Promise<Resultado> {
    await this.getById(id);
    return this.prisma.resultado.update({
      where: { id_resultado: id },
      data,
    });
  }

  async delete(id: number): Promise<Resultado> {
    await this.getById(id);
    return this.prisma.resultado.delete({
      where: { id_resultado: id },
    });
  }
}

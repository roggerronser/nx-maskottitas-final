import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Vacuna } from '@prisma/client';

@Injectable()
export class VacunaService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Vacuna[]> {
    return this.prisma.vacuna.findMany({
      include: {
        tipos_vacuna: true,
        paciente: true,
      },
    });
  }

  async getById(id: number): Promise<Vacuna> {
    const vacuna = await this.prisma.vacuna.findUnique({
      where: { id_vacuna: id },
      include: { tipos_vacuna: true, paciente: true },
    });
    if (!vacuna) throw new NotFoundException('Vacuna no encontrada');
    return vacuna;
  }

  async create(data: any): Promise<Vacuna> {

    return this.prisma.vacuna.create({
      data: {
        aplicacion_vacuna: data.aplicacion_vacuna,
        estado_vacuna: data.estado_vacuna,
        temperatura_vacuna: data.temperatura_vacuna,
        fc_vacuna: data.fc_vacuna,
        fr_vacuna: data.fr_vacuna,
        mucosa_vacuna: data.mucosa_vacuna,
        fecha_vacuna: data.fecha_vacuna,
        proxima_vacuna: data.proxima_vacuna,
        id_paciente: data.id_paciente,

        tipos_vacuna: {
          connect: data.tipos_vacuna
        }
      },
      include: { tipos_vacuna: true, paciente: true }
    });
  }

  async update(id: number, data: any): Promise<Vacuna> {
    return this.prisma.vacuna.update({
      where: { id_vacuna: id },
      data: {
        ...data,
        tipos_vacuna: data.tipos_vacuna
          ? { set: data.tipos_vacuna }
          : undefined,
      },
      include: { tipos_vacuna: true, paciente: true }
    });
  }
  
  

  async delete(id: number): Promise<Vacuna> {
    return this.prisma.vacuna.delete({ where: { id_vacuna: id } });
  }
}

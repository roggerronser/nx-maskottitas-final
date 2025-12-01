import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Consulta, Prisma } from '@prisma/client';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';

@Injectable()
export class ConsultaService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Consulta[]> {
    return this.prisma.consulta.findMany({
      include: { sintomas: true, paciente: true },
    });
  }

  async getById(id: number): Promise<Consulta> {
    const consulta = await this.prisma.consulta.findUnique({
      where: { id_consulta: id },
      include: { sintomas: true, paciente: true },
    });

    if (!consulta) throw new NotFoundException(`Consulta ${id} no encontrada`);
    return consulta;
  }

  async create(data: CreateConsultaDto): Promise<Consulta> {
    return this.prisma.consulta.create({
      data: {
        edad: data.edad,
        anamnesis: data.anamnesis,
        caracteristica: data.caracteristica,
        temperatura: new Prisma.Decimal(data.temperatura),
        fc: data.fc,
        fr: data.fr,
        hidratacion: data.hidratacion,
        mucosas: data.mucosas,
        tiempo_relleno_capilar: data.tiempo_relleno_capilar,
        spo2: new Prisma.Decimal(data.spo2),
        glucosa: new Prisma.Decimal(data.glucosa),
        presion_arterial: data.presion_arterial,
        otros: data.otros,
        fecha_consulta: new Date(data.fecha_consulta),
        estado_consulta: data.estado_consulta,

        paciente: { connect: { id_paciente: data.id_paciente } },

        sintomas: {
          connect: data.id_sintoma.map(id => ({ id_sintoma: id })),
        },
      },
      include: { sintomas: true, paciente: true },
    });
  }

  async update(id: number, data: UpdateConsultaDto): Promise<Consulta> {
    await this.getById(id);

    return this.prisma.consulta.update({
      where: { id_consulta: id },
      data: {
        ...(data.edad !== undefined && { edad: data.edad }),
        ...(data.anamnesis !== undefined && { anamnesis: data.anamnesis }),
        ...(data.caracteristica !== undefined && { caracteristica: data.caracteristica }),
        ...(data.fc !== undefined && { fc: data.fc }),
        ...(data.fr !== undefined && { fr: data.fr }),
        ...(data.hidratacion !== undefined && { hidratacion: data.hidratacion }),
        ...(data.mucosas !== undefined && { mucosas: data.mucosas }),
        ...(data.tiempo_relleno_capilar !== undefined && { tiempo_relleno_capilar: data.tiempo_relleno_capilar }),
        ...(data.presion_arterial !== undefined && { presion_arterial: data.presion_arterial }),
        ...(data.otros !== undefined && { otros: data.otros }),
        ...(data.estado_consulta !== undefined && { estado_consulta: data.estado_consulta }),

        // DECIMAL
        temperatura: data.temperatura !== undefined ? new Prisma.Decimal(data.temperatura) : undefined,
        spo2: data.spo2 !== undefined ? new Prisma.Decimal(data.spo2) : undefined,
        glucosa: data.glucosa !== undefined ? new Prisma.Decimal(data.glucosa) : undefined,

        // FECHA
        fecha_consulta: data.fecha_consulta ? new Date(data.fecha_consulta) : undefined,

        // RELACIÓN PACIENTE — ¡CORREGIDO!
        ...(data.id_paciente !== undefined && {
          paciente: { connect: { id_paciente: data.id_paciente } },
        }),

        // RELACIÓN SÍNTOMA
        ...(data.id_sintoma !== undefined && {
          sintomas: {
            set: data.id_sintoma.map(id => ({ id_sintoma: id })),
          },
        }),
      },
      include: { sintomas: true, paciente: true },
    });
  }

  async delete(id: number): Promise<Consulta> {
    await this.getById(id);
    return this.prisma.consulta.delete({
      where: { id_consulta: id },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Paciente } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PacienteService {
  constructor(private prisma: PrismaService) {}

  // Obtener todos los pacientes
  async getAll(): Promise<Paciente[]> {
    return this.prisma.paciente.findMany({
      include: { cliente: true }, // opcional: incluye datos del cliente
    });
  }

  // Obtener un paciente por ID
  async getById(id: number): Promise<Paciente> {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id_paciente: id },
      include: { cliente: true },
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente con id ${id} no encontrado`);
    }
    return paciente;
  }

  // Crear un nuevo paciente
  async create(data: Omit<Paciente, 'id_paciente'>): Promise<Paciente> {
    return this.prisma.paciente.create({ data });
  }

  // Actualizar un paciente existente
  async update(id: number, data: Partial<Omit<Paciente, 'id_paciente'>>): Promise<Paciente> {
    await this.getById(id); // Verifica existencia
    return this.prisma.paciente.update({
      where: { id_paciente: id },
      data,
    });
  }

  // Eliminar un paciente
  async delete(id: number): Promise<Paciente> {
    await this.getById(id);
    return this.prisma.paciente.delete({
      where: { id_paciente: id },
    });
  }
}

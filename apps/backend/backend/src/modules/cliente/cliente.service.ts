// apps/backend/src/modules/cliente/cliente.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cliente } from '@prisma/client';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Cliente[]> {
    return this.prisma.cliente.findMany();
  }

  async getById(id: number): Promise<Cliente> {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id_cliente: id },
    });
    if (!cliente) throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    return cliente;
  }

  async create(data: CreateClienteDto): Promise<Cliente> {
    return this.prisma.cliente.create({ data });
  }

  async update(id: number, data: UpdateClienteDto): Promise<Cliente> {
    await this.getById(id); // valida existencia
    return this.prisma.cliente.update({ where: { id_cliente: id }, data });
  }

  async delete(id: number): Promise<Cliente> {
    await this.getById(id); // valida existencia
    return this.prisma.cliente.delete({ where: { id_cliente: id } });
  }
}

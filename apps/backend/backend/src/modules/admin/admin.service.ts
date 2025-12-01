import { Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Obtener todos los admins
  async getAll(): Promise<Admin[]> {
    return this.prisma.admin.findMany();
  }

  // Obtener un admin por username
  async getByUsername(username: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({ where: { username } });
  }

  // Crear nuevo admin
  async create(data: Omit<Admin, 'id_admin'>): Promise<Admin> {
    return this.prisma.admin.create({ data });
  }

  // Actualizar un admin
  async update(id_admin: number, data: Partial<Admin>): Promise<Admin> {
    return this.prisma.admin.update({
      where: { id_admin },
      data,
    });
  }

  // Eliminar un admin
  async delete(id_admin: number): Promise<Admin> {
    return this.prisma.admin.delete({
      where: { id_admin },
    });
  }
}

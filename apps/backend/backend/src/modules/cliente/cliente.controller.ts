// apps/backend/src/modules/cliente/cliente.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from '@prisma/client';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  getAll(): Promise<Cliente[]> {
    return this.clienteService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Cliente> {
    return this.clienteService.getById(+id);
  }

  @Post()
  create(@Body() data: CreateClienteDto): Promise<Cliente> {
    return this.clienteService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateClienteDto): Promise<Cliente> {
    return this.clienteService.update(+id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Cliente> {
    return this.clienteService.delete(+id);
  }
}

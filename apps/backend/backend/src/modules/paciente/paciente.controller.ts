import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { Paciente } from '@prisma/client';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Get()
  getAll(): Promise<Paciente[]> {
    return this.pacienteService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Paciente> {
    return this.pacienteService.getById(Number(id));
  }

  @Post()
  create(@Body() data: CreatePacienteDto): Promise<Paciente> {
    return this.pacienteService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdatePacienteDto): Promise<Paciente> {
    return this.pacienteService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Paciente> {
    return this.pacienteService.delete(Number(id));
  }
}

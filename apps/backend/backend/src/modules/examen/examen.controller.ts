// src/modules/examen/examen.controller.ts
import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { ExamenService } from './examen.service';
import { Examen } from '@prisma/client';
import { CreateExamenDto } from './dto/create-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';

@Controller('examen')
export class ExamenController {
  constructor(private readonly examenService: ExamenService) {}

  @Get()
  getAll(): Promise<Examen[]> {
    return this.examenService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Examen> {
    return this.examenService.getById(+id);
  }

  @Post()
  create(@Body() data: CreateExamenDto): Promise<Examen> {
    return this.examenService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateExamenDto,
  ): Promise<Examen> {
    return this.examenService.update(+id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Examen> {
    return this.examenService.delete(+id);
  }

  @Get('consulta/:id')
  getByConsulta(@Param('id') id: string): Promise<Examen[]> {
    return this.examenService.getByConsulta(+id);
  }
}

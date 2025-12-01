import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ResultadoService } from './resultado.service';
import { CreateResultadoDto } from './dto/create-resultado.dto';
import { UpdateResultadoDto } from './dto/update-resultado.dto';
import { Resultado } from '@prisma/client';

@Controller('resultado')
export class ResultadoController {
  constructor(private readonly resultadoService: ResultadoService) {}

  @Get()
  getAll(): Promise<Resultado[]> {
    return this.resultadoService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Resultado> {
    return this.resultadoService.getById(Number(id));
  }

  @Post()
  create(@Body() data: CreateResultadoDto): Promise<Resultado> {
    return this.resultadoService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateResultadoDto
  ): Promise<Resultado> {
    return this.resultadoService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Resultado> {
    return this.resultadoService.delete(Number(id));
  }
}

import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TipoVacunaService } from './tipo-vacuna.service';
import { TipoVacuna } from '@prisma/client';
import { CreateTipoVacunaDto } from './dto/create-tipo-vacuna.dto';
import { UpdateTipoVacunaDto } from './dto/update-tipo-vacuna.dto';

@Controller('tipo-vacuna')
export class TipoVacunaController {
  constructor(private readonly tipoVacunaService: TipoVacunaService) {}

  @Get()
  getAll(): Promise<TipoVacuna[]> {
    return this.tipoVacunaService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<TipoVacuna> {
    return this.tipoVacunaService.getById(Number(id));
  }

  @Post()
  create(@Body() dto: CreateTipoVacunaDto): Promise<TipoVacuna> {
    return this.tipoVacunaService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTipoVacunaDto,
  ): Promise<TipoVacuna> {
    return this.tipoVacunaService.update(Number(id), dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<TipoVacuna> {
    return this.tipoVacunaService.delete(Number(id));
  }
}

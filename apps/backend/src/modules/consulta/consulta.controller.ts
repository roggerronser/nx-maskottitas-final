import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';

@Controller('consulta')
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}

  @Get()
  getAll() {
    return this.consultaService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.consultaService.getById(Number(id));
  }

  @Post()
  create(@Body() data: CreateConsultaDto) {
    return this.consultaService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateConsultaDto) {
    return this.consultaService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.consultaService.delete(Number(id));
  }
}

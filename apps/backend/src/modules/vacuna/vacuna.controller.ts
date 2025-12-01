import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { VacunaService } from './vacuna.service';
import { CreateVacunaDto } from './dto/create-vacuna.dto';
import { UpdateVacunaDto } from './dto/update-vacuna.dto';

@Controller('vacuna')
export class VacunaController {
  constructor(private readonly vacunaService: VacunaService) {}

  @Get()
  getAll() {
    return this.vacunaService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.vacunaService.getById(Number(id));
  }

  @Post()
  create(@Body() data: CreateVacunaDto) {
    return this.vacunaService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateVacunaDto) {
    return this.vacunaService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.vacunaService.delete(Number(id));
  }
}

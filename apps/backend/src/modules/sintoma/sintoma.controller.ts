import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SintomaService } from './sintoma.service';
import { Sintoma } from '@prisma/client';

@Controller('sintoma')
export class SintomaController {
  constructor(private readonly sintomaService: SintomaService) {}

  @Get()
  getAll(): Promise<Sintoma[]> {
    return this.sintomaService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Sintoma> {
    return this.sintomaService.getById(Number(id));
  }

  @Post()
  create(@Body() data: { sintoma: string }): Promise<Sintoma> {
    return this.sintomaService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: { sintoma?: string }): Promise<Sintoma> {
    return this.sintomaService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Sintoma> {
    return this.sintomaService.delete(Number(id));
  }
}

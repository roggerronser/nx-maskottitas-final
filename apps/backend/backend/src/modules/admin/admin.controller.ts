import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from '@prisma/client';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getAll(): Promise<Admin[]> {
    return this.adminService.getAll();
  }

  @Get('by-username/:username')
  getByUsername(@Param('username') username: string): Promise<Admin | null> {
    return this.adminService.getByUsername(username);
  }

  @Post()
  create(@Body() data: Omit<Admin, 'id_admin'>): Promise<Admin> {
    return this.adminService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Admin>): Promise<Admin> {
    return this.adminService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Admin> {
    return this.adminService.delete(Number(id));
  }
}

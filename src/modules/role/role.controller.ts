import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from './decorators/role.decorators';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from './guards/role.guards';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}

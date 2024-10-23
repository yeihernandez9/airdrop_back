import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guards';
import { Roles } from '../role/decorators/role.decorators';
import { ForgotPasswordDto } from './dto/forgot-password';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    const createUser = this.userService.create(createUserDto);
    return createUser;
  }

  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles('USER', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Get()
  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Patch('/forgot/:email')
  @UsePipes(ValidationPipe)
  forgotPassword(
    @Param('email') email: string,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.userService.forgotPassword(email, forgotPasswordDto);
  }


  //servicio para asignar un rol a un usuario
  @Post('/setRole/:userId/:roleId')
  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  async setRoleToUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('roleId', ParseUUIDPipe) roleId: string,
  ){
    return this.userService.setRoleToUser(userId, roleId);
  }
}

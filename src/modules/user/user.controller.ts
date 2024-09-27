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
  @Roles('USER', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN')
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
}

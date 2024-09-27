import { compare } from 'bcrypt';
import { SharedService } from './../../shared/shared.service';
import { SigninDto } from './dto/signin.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserEntity } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../role/role.entity';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './jwt-payload.interface';
import { RoleType } from '../role/role.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly _roleRepository: Repository<RoleEntity>,
    private readonly _jwtService: JwtService,
    private readonly _shared: SharedService,
  ) {}

  async login(signinDto: SigninDto) {
    const { email, password } = signinDto;

    const user: UserEntity = await this._userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return {
        status: HttpStatus.FOUND,
        message: 'invalid credentials',
      };
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return {
        status: HttpStatus.FOUND,
        message: 'invalid credentials',
      };
    }

    delete user.password;

    const payload: IJwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map((r) => r.name as RoleType),
    };

    const token = await this._jwtService.sign(payload);

    return {
      status: HttpStatus.OK,
      message: 'user logged in successfully',
      user,
      token,
    };
  }
}

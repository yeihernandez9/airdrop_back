import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { RoleEntity } from '../role/role.entity';
import { RoleType } from '../role/role.type';
import { ForgotPasswordDto } from './dto/forgot-password';
import { UserDetailsEntity } from './user.details.entity';
import { WalletEntity } from '../wallet/wallet.entity';
import { ethers } from 'ethers';
import { withLatestFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly _roleRepository: Repository<RoleEntity>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { username, email } = createUserDto;

    const existUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    console.log(existUser);

    if (existUser) {
      throw new ConflictException('Username or Email already exist');
    }

    const defaultRole: RoleEntity = await this._roleRepository.findOne({
      where: { name: RoleType.USER },
    });

    const user = new UserEntity();
    user.username = username;
    user.email = email;

    const details = new UserDetailsEntity();
    details.name = createUserDto.name;
    details.lastname = createUserDto.lastname;
    details.phone = createUserDto.phone;

    user.details = details;

    const salt = await genSalt(10);
    user.password = await hash(createUserDto.password, salt);

    const wallet = await this.createWallet('loquesa');
    console.log(wallet.address);

    const walletEntity = new WalletEntity();
    walletEntity.address = wallet.address;
    walletEntity.prvate_key = wallet.private_key;
    walletEntity.password = await hash(createUserDto.password, salt);

    user.roles = [defaultRole];
    user.wallet = walletEntity;

    const save = this.userRepository.save(user);

    console.log('SAVE#######', save);
    return {
      data: user,
    };
  }

  async findAll() {
    const users: UserEntity[] = await this.userRepository.find({
      where: { status: 'ACTIVE' },
    });

    users.forEach((user) => {
      delete user.password;
    });

    return users;
  }

  async findOne(id: string) {
    const userExist = await this.userRepository.findOne({
      where: { id },
    });

    if (!userExist) {
      throw new ConflictException('User not found');
    }

    delete userExist.password;

    return userExist;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { username } = updateUserDto;
    const userExist = await this.userRepository.findOne({
      where: { id },
    });

    if (!userExist) {
      throw new ConflictException('User not found');
    }

    await this.userRepository.update(id, { username: username });
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const userExist = await this.userRepository.findOne({
      where: { id },
    });

    if (!userExist) {
      throw new ConflictException('User not found');
    }

    await this.userRepository.delete(id);

    return `This action removes a #${id} user`;
  }

  async forgotPassword(email: string, forgotPassword: ForgotPasswordDto) {
    //buscar ususario por email
    const emailExists = await this.userRepository.findOne({
      where: { email: email },
    });

    console.log(emailExists);

    //si existe no retorne mensaje de lo contrario retorna un mensaje indicando que no  existe el usuario
    if (!emailExists) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'user not found',
      };
    }

    //gernar un salt osea una encryptacion
    const salt = await genSalt(10);

    //instanciamos la entity de usuario
    const user = new UserEntity();
    user.password = await hash(forgotPassword.password, salt);

    //actualizamos la contraseña del usuario
    await this.userRepository.update(emailExists.id, user);

    return {
      status: HttpStatus.OK,
      message: 'user change password success',
    };
  }

  async createWallet(password: string): Promise<any> {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      private_key: wallet.privateKey,
      password,
    };
  }
}

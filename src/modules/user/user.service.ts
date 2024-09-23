import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    const existUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    console.log(existUser);

    if (existUser) {
      throw new ConflictException('Username or Email already exist');
    }

    const salt = await genSalt(10);

    const user = new UserEntity();
    user.username = username;
    user.email = email;
    user.password = await hash(password, salt);

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
}

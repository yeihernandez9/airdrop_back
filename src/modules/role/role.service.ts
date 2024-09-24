import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly _roleRepository: Repository<RoleEntity>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const roleExists = await this._roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (!roleExists) {
      const role = await this._roleRepository.save(createRoleDto);
      return role;
    }

    const updateRole = await this._roleRepository.update(roleExists.id, {
      status: 'ACTIVE',
    });

    return updateRole;
  }

  async findAll() {
    const roles = await this._roleRepository.find({
      where: { status: 'ACTIVE' },
    });
    return roles;
  }

  async findOne(id: string) {
    const roleExists = await this._roleRepository.findOne({
      where: { id, status: 'ACTIVE' },
    });

    if (!roleExists) {
      throw new NotFoundException();
    }

    return roleExists;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const roleExists = await this._roleRepository.findOne({
      where: { id },
    });

    if (!roleExists) {
      throw new NotFoundException();
    }
    const updateRole = await this._roleRepository.update(id, updateRoleDto);
    return updateRole;
  }

  async remove(id: string) {
    const roleExists = await this._roleRepository.findOne({
      where: { id, status: 'ACTIVE' },
    });

    if (!roleExists) {
      throw new NotFoundException();
    }
    await this._roleRepository.delete(id);
    return `This action removes a #${id} role`;
  }
}

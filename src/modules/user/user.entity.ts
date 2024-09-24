import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from '../role/role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column('varchar', { unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column('text')
  @Exclude()
  password: string;

  @Column({ type: 'varchar', default: 'ACTIVE', length: 13 })
  status: string;

  @ManyToMany((type) => RoleEntity, (role) => role.users, { eager: true })
  @JoinTable({ name: 'user_roles' })
  roles: RoleEntity[];
}

import { Exclude } from 'class-transformer';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wallet')
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column('varchar', { unique: true })
  address: string;

  @Index({ unique: true })
  @Column('varchar', { unique: true })
  prvate_key: string;

  @Column('text')
  @Exclude()
  password: string;
}

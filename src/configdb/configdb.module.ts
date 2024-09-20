import { Module } from '@nestjs/common';
import { ConfigdbService } from './configdb.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: ConfigdbService })],
})
export class ConfigdbModule {}

import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigdbService implements TypeOrmOptionsFactory {
  constructor() {
    dotenv.config();
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction = process.env.NODE_ENV === 'production';
    const sslOptions = isProduction ? { rejectUnauthorized: false } : null;

    return {
      type: 'postgres',
      url: this.createTypeOrmUrl(),
      ssl: sslOptions,
      synchronize: false,
      logging: true,
      entities: [__dirname + '../../modules/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '../../database/migrations/*{.ts,.js}'],
      migrationsRun: false,
    };
  }

  private createTypeOrmUrl(): string {
    const isProduction = process.env.NODE_ENV === 'production';
    const sslOptions = isProduction
      ? '&sslmode=require&rejectUnauthorized=false'
      : '';
    if (process.env.NODE_ENV === 'production') {
      console.log('Base de datos PRODUCCION');
      return `${process.env.DATABASE_URL}`;
    } else {
      console.log('Base de datos DEV');
      console.log(process.env.DB_PASSWD);
      return `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?${sslOptions}`;
    }
  }
}

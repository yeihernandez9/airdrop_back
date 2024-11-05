import { DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { DataSourceOptions } from 'typeorm/data-source';

import InitSeeder from '../seed/init.seeder';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: '.env.development',
});

console.log(process.env.DB_USERNAME);

const options = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(String(process.env.DB_PORT), 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWD || '',
  database: process.env.DB_DATABASE || 'airdrop',
  entities: [__dirname + '/../../src/modules/**/*.entity.ts'],
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/../migrations/**/*.ts'],
  seeds: [InitSeeder],
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : null,
};

export const source = new DataSource(
  options as DataSourceOptions & SeederOptions,
);

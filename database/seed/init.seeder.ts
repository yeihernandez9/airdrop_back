import { DataSource } from 'typeorm';
import { runSeeders, Seeder, SeederFactoryManager } from 'typeorm-extension';
import userFactory from 'database/factories/user.factory';
import UserSeeder from './user.seeder';
import RoleSeeder from './role.seeder';
import roleFactory from 'database/factories/role.factory';

export default class InitSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [UserSeeder, RoleSeeder],
      factories: [userFactory, roleFactory],
    });
  }
}

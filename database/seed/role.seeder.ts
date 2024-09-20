import { Role } from '../../src/modules/role/entities/role.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Role);

    const data = {
      name: 'SUPER_ADMIN',
      description: 'SUPER_ADMIN',
      status: 'ACTIVE',
    };

    const data2 = {
      name: 'ADMIN',
      description: 'SUPER_ADMIN',
      status: 'ACTIVE',
    };

    const data3 = {
      name: 'USER',
      description: 'USER',
      status: 'ACTIVE',
    };

    const roleFactory = await factoryManager.get(Role);

    // Insert only one record.
    await repository.save(data);
    await repository.save(data2);
    await repository.save(data3);

    await roleFactory.saveMany(2);
  }
}

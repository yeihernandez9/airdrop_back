import { hash } from 'bcrypt';
//import { RoleType } from 'src/modules/role/roletype.enum';
import { UserEntity } from '../../src/modules/user/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);

    const data = {
      username: 'admin',
      email: 'admin@example.com',
      password: await hash('loquesea', 10),
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    };

    const user = await repository.findOneBy({ username: data.username });

    // Insert only one record with this username.
    if (!user) {
      await repository.insert([data]);
    }

    // ---------------------------------------------------

    const userFactory = await factoryManager.get(UserEntity);

    // Insert only one record.
    await userFactory.save();

    // Insert many records in database.
    await userFactory.saveMany(1);
  }
}

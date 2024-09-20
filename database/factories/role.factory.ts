import { Role } from '../../src/modules/role/entities/role.entity';
//import { Status } from 'src/shared/entity-status.enum';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Role, (faker) => {
  const role = new Role();

  //role.name = faker.internet.url();
  //role.status = Status.ACTIVE;

  return role;
});

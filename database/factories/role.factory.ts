import { RoleEntity } from '../../src/modules/role/role.entity';
//import { Status } from 'src/shared/entity-status.enum';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(RoleEntity, (faker) => {
  const role = new RoleEntity();

  //role.name = faker.internet.url();
  //role.status = Status.ACTIVE;

  return role;
});

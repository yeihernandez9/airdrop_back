import { UserEntity } from '../../src/modules/user/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import { hash } from 'bcrypt';

export default setSeederFactory(UserEntity, async (faker) => {
  const user = new UserEntity();

  /*user.username = faker.name.firstName();
  user.email = faker.name.lastName();
  user.email = faker.internet.email(user.username, user.username);
  user.password = await hash(faker.internet.password(), 10);*/
  return user;
});

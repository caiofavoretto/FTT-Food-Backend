import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import UserData from './data/Users';
import User from '../../models/User';
import Role from '../../models/Role';

export default class SeedUsers1593551420081 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    const usersRepository = getRepository(User, 'seed');
    const rolesRepository = getRepository(Role, 'seed');

    const users = await usersRepository.find();
    const roles = await rolesRepository.find();

    const usersExist = users.map(user => user.registry);

    const usersToCreate = UserData.map(async user => {
      if (!usersExist.includes(user.registry)) {
        const parsedUser = user;

        if (user.registry === 'admin') {
          const roleEmployee = roles.find(
            role => role.description === 'Funcionário'
          )?.id;

          parsedUser.role_id = roleEmployee || 1;
        }

        const newUser = usersRepository.create(parsedUser);

        const userCreated = await usersRepository.save(newUser);

        return userCreated;
      }

      return usersExist.find(userExist => userExist === user.registry);
    });

    await Promise.all(usersToCreate);
  }

  public async down(_: QueryRunner): Promise<void> {
    // Do Nothing
  }
}

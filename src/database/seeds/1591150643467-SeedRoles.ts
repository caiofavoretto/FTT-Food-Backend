import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import RoleData from './data/Roles';
import Role from '../../models/Role';

export default class SeedRoles1591150643467 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    const roleRepository = getRepository(Role, 'seed');

    const roles = await roleRepository.find();

    const rolesExist = roles.map(role => role.description);

    RoleData.forEach(async role => {
      if (!rolesExist.includes(role.description)) {
        const newRole = roleRepository.create(role);

        await roleRepository.save(newRole);
      }
    });
  }

  public async down(_: QueryRunner): Promise<void> {
    // Do Nothing
  }
}

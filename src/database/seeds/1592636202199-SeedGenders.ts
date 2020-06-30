import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import GenderData from './data/Genders';
import Gender from '../../models/Gender';

export default class SeedGenders1592636202199 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    const genderRepository = getRepository(Gender, 'seed');

    const genders = await genderRepository.find();

    const gendersExist = genders.map(gender => gender.description);

    GenderData.map(async gender => {
      if (!gendersExist.includes(gender.description)) {
        const newGender = genderRepository.create(gender);

        await genderRepository.save(newGender);
      }
    });
  }

  public async down(_: QueryRunner): Promise<void> {
    // Do Nothing
  }
}

import {
  MigrationInterface,
  QueryRunner,
  getRepository,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import Rating from '../../models/Rating';

export default class SetMenuIdFieldFromRatingsToNotNullable1593704016762
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const ratingsRepository = getRepository(Rating);

    const ratings = await ratingsRepository.find();

    if (ratings.length) {
      await ratingsRepository.remove(ratings);
    }

    const table = await queryRunner.getTable('ratings');
    const fks = ['RatingsMeal', 'RatingsUser', 'RatingsMenu'];

    const foreignKeys = table?.foreignKeys.filter(fk =>
      fks.includes(String(fk.name))
    );

    if (foreignKeys?.length) {
      await queryRunner.dropForeignKeys('ratings', foreignKeys);
    }

    await queryRunner.changeColumn(
      'ratings',
      'menu_id',
      new TableColumn({
        name: 'menu_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'ratings',
      'meal_id',
      new TableColumn({
        name: 'meal_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      'ratings',
      'user_id',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKeys('ratings', [
      new TableForeignKey({
        name: 'RatingsUser',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'RatingsMeal',
        columnNames: ['meal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meals',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'RatingsMenu',
        columnNames: ['menu_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'menus',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('ratings');
    const fks = ['RatingsMeal', 'RatingsUser', 'RatingsMenu'];

    const foreignKeys = table?.foreignKeys.filter(fk =>
      fks.includes(String(fk.name))
    );

    if (foreignKeys?.length) {
      await queryRunner.dropForeignKeys('ratings', foreignKeys);
    }

    await queryRunner.changeColumn(
      'ratings',
      'menu_id',
      new TableColumn({
        name: 'menu_id',
        type: 'uuid',
        isNullable: false,
      })
    );

    await queryRunner.changeColumn(
      'ratings',
      'meal_id',
      new TableColumn({
        name: 'meal_id',
        type: 'uuid',
        isNullable: false,
      })
    );

    await queryRunner.changeColumn(
      'ratings',
      'user_id',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      })
    );

    await queryRunner.createForeignKeys('ratings', [
      new TableForeignKey({
        name: 'RatingsUser',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'RatingsMeal',
        columnNames: ['meal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meals',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'RatingsMenu',
        columnNames: ['menu_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'menus',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    ]);
  }
}

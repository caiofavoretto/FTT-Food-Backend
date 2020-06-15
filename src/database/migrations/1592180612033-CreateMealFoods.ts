import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateMealFoods1592180612033
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'meals_foods_foods',
        columns: [
          {
            name: 'meals_id',
            type: 'uuid',
          },
          {
            name: 'foods_id',
            type: 'uuid',
          },
        ],
      })
    );

    await queryRunner.createForeignKeys('meals_foods_foods', [
      new TableForeignKey({
        name: 'Meal',
        columnNames: ['meals_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meals',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'Food',
        columnNames: ['foods_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'foods',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('meals_foods_foods');

    const foreignKeys = table?.foreignKeys.filter(
      fk => fk.name === 'Meal' || fk.name === 'Food'
    );

    if (foreignKeys?.length) {
      await queryRunner.dropForeignKeys('meals_foods_foods', foreignKeys);
    }

    await queryRunner.dropTable('meals_foods_foods');
  }
}

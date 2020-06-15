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
        name: 'meal_foods',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'meal_id',
            type: 'uuid',
          },
          {
            name: 'food_id',
            type: 'uuid',
          },
        ],
      })
    );

    await queryRunner.createForeignKeys('meal_foods', [
      new TableForeignKey({
        name: 'Meal',
        columnNames: ['meal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meals',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'Food',
        columnNames: ['food_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'foods',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('meal_foods');

    const foreignKeys = table?.foreignKeys.filter(
      fk => fk.name === 'Meal' || fk.name === 'Food'
    );

    if (foreignKeys?.length) {
      await queryRunner.dropForeignKeys('meal_foods', foreignKeys);
    }

    await queryRunner.dropTable('meal_foods');
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateMenus1592273345159 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'menus',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'initial_date',
            type: 'timestamp with time zone',
          },
          {
            name: 'end_date',
            type: 'timestamp with time zone',
          },
          {
            name: 'monday_meal_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'tuesday_meal_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'wednesday_meal_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'thursday_meal_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'friday_meal_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    await queryRunner.createForeignKeys('menus', [
      new TableForeignKey({
        name: 'MenuMealMonday',
        columnNames: ['monday_meal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meals',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'MenuMealTuesday',
        columnNames: ['tuesday_meal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meals',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'MenuMealWednesday',
        columnNames: ['wednesday_meal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meals',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'MenuMealThursday',
        columnNames: ['thursday_meal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meals',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'MenuMealFriday',
        columnNames: ['friday_meal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meals',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('menus');
    const fks = [
      'MenuMealMonday',
      'MenuMealTuesday',
      'MenuMealWednesday',
      'MenuMealThursday',
      'MenuMealFriday',
    ];

    const foreignKeys = table?.foreignKeys.filter(fk =>
      fks.includes(String(fk.name))
    );

    if (foreignKeys?.length) {
      await queryRunner.dropForeignKeys('menus', foreignKeys);
    }

    await queryRunner.dropTable('menus');
  }
}

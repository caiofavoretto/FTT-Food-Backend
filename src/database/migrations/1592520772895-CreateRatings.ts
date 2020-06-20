import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateRatings1592520772895 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ratings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'grade',
            type: 'integer',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'meal_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
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
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('ratings');
    const fks = ['RatingsMeal', 'RatingsUser'];

    const foreignKeys = table?.foreignKeys.filter(fk =>
      fks.includes(String(fk.name))
    );

    if (foreignKeys?.length) {
      await queryRunner.dropForeignKeys('ratings', foreignKeys);
    }

    await queryRunner.dropTable('ratings');
  }
}

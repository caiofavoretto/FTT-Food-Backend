import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateSuggestions1592953493636
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'suggestions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'food_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      })
    );

    await queryRunner.createForeignKeys('suggestions', [
      new TableForeignKey({
        name: 'SuggestionUser',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'SuggestionFood',
        columnNames: ['food_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'foods',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('suggestions');
    const fks = ['SuggestionUser', 'SuggestionFood'];

    const foreignKeys = table?.foreignKeys.filter(fk =>
      fks.includes(String(fk.name))
    );

    if (foreignKeys?.length) {
      await queryRunner.dropForeignKeys('suggestions', foreignKeys);
    }

    await queryRunner.dropTable('suggestions');
  }
}

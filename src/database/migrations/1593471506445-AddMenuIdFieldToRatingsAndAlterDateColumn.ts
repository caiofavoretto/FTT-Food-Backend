import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddMenuIdFieldToRatings1593471506445
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('ratings', 'created_at');

    await queryRunner.addColumns('ratings', [
      new TableColumn({
        name: 'date',
        type: 'timestamp with time zone',
      }),
      new TableColumn({
        name: 'menu_id',
        type: 'uuid',
      }),
    ]);

    await queryRunner.createForeignKey(
      'ratings',
      new TableForeignKey({
        name: 'RatingsMenu',
        columnNames: ['menu_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'menus',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('ratings', 'RatingsMenu');

    const table = await queryRunner.getTable('ratings');
    const fields = ['menu_id', 'date'];

    const tableFields = table?.columns.filter(field =>
      fields.includes(String(field.name))
    );

    if (tableFields?.length) {
      await queryRunner.dropColumns('ratings', tableFields);
    }

    await queryRunner.addColumn(
      'ratings',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      })
    );
  }
}

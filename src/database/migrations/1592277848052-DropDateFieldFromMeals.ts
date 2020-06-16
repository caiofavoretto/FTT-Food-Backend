import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class DropDateFieldFromMeals1592277848052
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('meals', 'date');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'meals',
      new TableColumn({
        name: 'date',
        type: 'timestamp with time zone',
      })
    );
  }
}

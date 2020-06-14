import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddImageFieldToFood1592011627164
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'foods',
      new TableColumn({
        name: 'image_url',
        type: 'varchar',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('foods', 'image_url');
  }
}

import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddGenderFieldToUsers1592635695929
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'gender_id',
        type: 'int',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'UsersGender',
        columnNames: ['gender_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'genders',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'UsersGender');
    await queryRunner.dropColumn('users', 'gender_id');
  }
}

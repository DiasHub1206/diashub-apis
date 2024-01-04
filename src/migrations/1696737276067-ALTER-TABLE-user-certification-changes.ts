import { MigrationInterface, QueryRunner } from 'typeorm';

export class ALTERTABLEUserCertificationChanges1696737276067
  implements MigrationInterface
{
  name = 'ALTERTABLEUserCertificationChanges1696737276067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_certification" RENAME COLUMN "company" to "organization"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_certification" RENAME COLUMN "degree" to "name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_certification" RENAME COLUMN "name" to "degree"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_certification" RENAME COLUMN "organization" to "company"`,
    );
  }
}

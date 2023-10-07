import { MigrationInterface, QueryRunner } from 'typeorm';

export class ALTERTABLEUserExperienceADDCOLUMNTitle1696691475953
  implements MigrationInterface
{
  name = 'ALTERTABLEUserExperienceADDCOLUMNTitle1696691475953';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_experience" ADD "title" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_experience" DROP COLUMN "title"`,
    );
  }
}

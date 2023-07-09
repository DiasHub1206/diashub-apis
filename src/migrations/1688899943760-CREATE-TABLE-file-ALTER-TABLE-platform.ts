import { MigrationInterface, QueryRunner } from 'typeorm';

export class CREATETABLEFileALTERTABLEPlatform1688899943760
  implements MigrationInterface
{
  name = 'CREATETABLEFileALTERTABLEPlatform1688899943760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "deleted" boolean NOT NULL, "name" character varying NOT NULL, "originalName" character varying NOT NULL, "url" character varying, "type" character varying NOT NULL, "mimeType" character varying NOT NULL, "size" bigint NOT NULL, "metadata" jsonb, "status" character varying NOT NULL DEFAULT 'uploaded', CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c8a0a024eae62e2c40cd2ffa15" ON "file" ("status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_experience" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_experience" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_education" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_education" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedBy"`);
    await queryRunner.query(
      `ALTER TABLE "user_certification" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_certification" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "profilePhotoId" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profilePhotoId"`);
    await queryRunner.query(
      `ALTER TABLE "user_certification" ADD "updatedBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_certification" ADD "createdBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updatedBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD "updatedBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD "createdBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_education" ADD "updatedBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_education" ADD "createdBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_experience" ADD "updatedBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_experience" ADD "createdBy" character varying`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c8a0a024eae62e2c40cd2ffa15"`,
    );
    await queryRunner.query(`DROP TABLE "file"`);
  }
}

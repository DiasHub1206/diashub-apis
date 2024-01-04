import { MigrationInterface, QueryRunner } from 'typeorm';

export class ALTERTABLEUserADDCOLUMNShortInfoAndAbout1704375143486
  implements MigrationInterface
{
  name = 'ALTERTABLEUserADDCOLUMNShortInfoAndAbout1704375143486';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "shortInfo" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "about" character varying`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "personalLink" character varying`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."feed_visibility_enum" RENAME TO "feed_visibility_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."feed_visibility_enum" AS ENUM('public', 'connection', 'group')`,
    );
    await queryRunner.query(
      `ALTER TABLE "feed" ALTER COLUMN "visibility" TYPE "public"."feed_visibility_enum" USING "visibility"::"text"::"public"."feed_visibility_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."feed_visibility_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."feed_visibility_enum_old" AS ENUM('public', 'connection', 'group')`,
    );
    await queryRunner.query(
      `ALTER TABLE "feed" ALTER COLUMN "visibility" TYPE "public"."feed_visibility_enum_old" USING "visibility"::"text"::"public"."feed_visibility_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."feed_visibility_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."feed_visibility_enum_old" RENAME TO "feed_visibility_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "personalLink"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "about"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "shortInfo"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CREATETABLESkillANDSkillUser1689829848643
  implements MigrationInterface
{
  name = 'CREATETABLESkillANDSkillUser1689829848643';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."skill_proficiency_enum" AS ENUM('beginner', 'intermediate', 'advanced')`,
    );
    await queryRunner.query(
      `CREATE TABLE "skill_to_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "deleted" boolean NOT NULL, "skillId" uuid NOT NULL, "userId" uuid NOT NULL, "proficiency" "public"."skill_proficiency_enum" NOT NULL, CONSTRAINT "UQ_34fdc1acc6c84ebbffba91c95cd" UNIQUE ("userId", "skillId"), CONSTRAINT "PK_d3f0594cfd101c4704a6db9dfef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "skill" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "deleted" boolean NOT NULL, "name" character varying NOT NULL, "createdBy" uuid NOT NULL, CONSTRAINT "UQ_0f49a593960360f6f85b692aca8" UNIQUE ("name"), CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0f49a593960360f6f85b692aca" ON "skill" ("name") `,
    );
    await queryRunner.query(
      `ALTER TABLE "skill_to_user" ADD CONSTRAINT "FK_50fb3b17650beb666683c66c925" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill_to_user" ADD CONSTRAINT "FK_16daa995fe423f9fe48e2d9ffe9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "skill_to_user" DROP CONSTRAINT "FK_16daa995fe423f9fe48e2d9ffe9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill_to_user" DROP CONSTRAINT "FK_50fb3b17650beb666683c66c925"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0f49a593960360f6f85b692aca"`,
    );
    await queryRunner.query(`DROP TABLE "skill"`);
    await queryRunner.query(`DROP TABLE "skill_to_user"`);
    await queryRunner.query(`DROP TYPE "public"."skill_proficiency_enum"`);
  }
}

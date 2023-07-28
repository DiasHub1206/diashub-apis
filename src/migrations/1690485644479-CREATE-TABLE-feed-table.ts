import { MigrationInterface, QueryRunner } from 'typeorm';

export class CREATETABLEFeedTable1690485644479 implements MigrationInterface {
  name = 'CREATETABLEFeedTable1690485644479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comment_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "deleted" boolean NOT NULL, "userId" uuid NOT NULL, "commentId" uuid NOT NULL, CONSTRAINT "UQ_5ddb528d11dfb6fdc09e623907b" UNIQUE ("commentId", "userId"), CONSTRAINT "PK_04f93e6f1ace5dbc1d8c562ccbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feed_comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "deleted" boolean NOT NULL, "userId" uuid NOT NULL, "text" text, "image" character varying, "feedId" uuid NOT NULL, "parentId" uuid, CONSTRAINT "PK_3150445d1f5eaea934548589b05" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."feed_visibility_enum" AS ENUM('public', 'connection', 'group')`,
    );
    await queryRunner.query(
      `CREATE TABLE "feed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "deleted" boolean NOT NULL, "userId" uuid NOT NULL, "content" text, "visibility" "public"."feed_visibility_enum" NOT NULL, "asset" jsonb NOT NULL, CONSTRAINT "PK_8a8dfd1ff306ccdf65f0b5d04b2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feed_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "feedId" uuid NOT NULL, CONSTRAINT "UQ_4336eba98ad4aa934c3f6b19d1b" UNIQUE ("feedId", "userId"), CONSTRAINT "PK_942f455569072c6a005c0a1d017" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feed_comment_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_04943f04e46836858824781fd5d" PRIMARY KEY ("id_ancestor", "id_descendant"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f08888de518dca66505068ab2" ON "feed_comment_closure" ("id_ancestor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b9c15ef6c209d5ca40f7458fb" ON "feed_comment_closure" ("id_descendant") `,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" ADD CONSTRAINT "FK_a253dba95eab8659c027bbace44" FOREIGN KEY ("commentId") REFERENCES "feed_comment"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "feed_comment" ADD CONSTRAINT "FK_b1a1d1f1300e517964a6af03dcf" FOREIGN KEY ("feedId") REFERENCES "feed"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "feed" ADD CONSTRAINT "FK_70952a3f1b3717e7021a439edda" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "feed_like" ADD CONSTRAINT "FK_c06d4b8c1c3dab3afc2213d9d13" FOREIGN KEY ("feedId") REFERENCES "feed"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "feed_comment_closure" ADD CONSTRAINT "FK_4f08888de518dca66505068ab20" FOREIGN KEY ("id_ancestor") REFERENCES "feed_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feed_comment_closure" ADD CONSTRAINT "FK_9b9c15ef6c209d5ca40f7458fbf" FOREIGN KEY ("id_descendant") REFERENCES "feed_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feed_comment_closure" DROP CONSTRAINT "FK_9b9c15ef6c209d5ca40f7458fbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feed_comment_closure" DROP CONSTRAINT "FK_4f08888de518dca66505068ab20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feed_like" DROP CONSTRAINT "FK_c06d4b8c1c3dab3afc2213d9d13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feed" DROP CONSTRAINT "FK_70952a3f1b3717e7021a439edda"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feed_comment" DROP CONSTRAINT "FK_b1a1d1f1300e517964a6af03dcf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" DROP CONSTRAINT "FK_a253dba95eab8659c027bbace44"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9b9c15ef6c209d5ca40f7458fb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4f08888de518dca66505068ab2"`,
    );
    await queryRunner.query(`DROP TABLE "feed_comment_closure"`);
    await queryRunner.query(`DROP TABLE "feed_like"`);
    await queryRunner.query(`DROP TABLE "feed"`);
    await queryRunner.query(`DROP TYPE "public"."feed_visibility_enum"`);
    await queryRunner.query(`DROP TABLE "feed_comment"`);
    await queryRunner.query(`DROP TABLE "comment_like"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class ALTERTABLEFeedCommentADDParentId1690492219247
  implements MigrationInterface
{
  name = 'ALTERTABLEFeedCommentADDParentId1690492219247';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feed_comment" ADD CONSTRAINT "FK_80485aab9059b7f310f8e91c88d" FOREIGN KEY ("parentId") REFERENCES "feed_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feed_comment" DROP CONSTRAINT "FK_80485aab9059b7f310f8e91c88d"`,
    );
  }
}

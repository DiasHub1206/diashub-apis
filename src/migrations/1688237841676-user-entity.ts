import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEntity1688237841676 implements MigrationInterface {
  name = 'UserEntity1688237841676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_accountstatus_enum" AS ENUM('active', 'inactive', 'locked')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "createdBy" character varying, "updatedBy" character varying, "deleted" boolean NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "mobileNumber" character varying NOT NULL, "countryCode" character varying NOT NULL DEFAULT '+91', "accountStatus" "public"."user_accountstatus_enum" NOT NULL DEFAULT 'inactive', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_accountstatus_enum"`);
  }
}

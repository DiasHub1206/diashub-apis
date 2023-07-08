import { MigrationInterface, QueryRunner } from 'typeorm';

export class CREATETABLEUserExperienceEducationProjectCertification1688771275871
  implements MigrationInterface
{
  name = 'CREATETABLEUserExperienceEducationProjectCertification1688771275871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_accountstatus_enum" AS ENUM('active', 'inactive', 'locked')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "createdBy" character varying, "updatedBy" character varying, "deleted" boolean NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "mobileNumber" character varying, "countryCode" character varying DEFAULT '+91', "role" character varying NOT NULL, "accountStatus" "public"."user_accountstatus_enum" NOT NULL DEFAULT 'inactive', "lastActiveOn" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."employment_type_enum" AS ENUM('full time', 'part time', 'self employed', 'freelance', 'internship', 'trainee')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."work_location_type_enum" AS ENUM('on site', 'hybrid', 'remote')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_experience" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "createdBy" character varying, "updatedBy" character varying, "deleted" boolean NOT NULL, "userId" uuid NOT NULL, "employmentType" "public"."employment_type_enum" NOT NULL DEFAULT 'full time', "companyName" character varying NOT NULL, "location" character varying NOT NULL, "workLocationType" "public"."work_location_type_enum" NOT NULL DEFAULT 'on site', "isCurrentlyWorking" boolean NOT NULL DEFAULT false, "startDate" date NOT NULL, "endDate" date, "description" character varying NOT NULL, CONSTRAINT "PK_bdc1c40be8922c5cbcf5be466f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_certification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "createdBy" character varying, "updatedBy" character varying, "deleted" boolean NOT NULL, "userId" uuid NOT NULL, "company" character varying NOT NULL, "degree" character varying NOT NULL, "credentialId" character varying, "credentialUrl" character varying, "issueDate" date NOT NULL, "expirationDate" date NOT NULL, CONSTRAINT "PK_151a08c14bf96d1a240f13a3260" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "createdBy" character varying, "updatedBy" character varying, "deleted" boolean NOT NULL, "userId" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "startDate" date, "endDate" date, "isCurrentlyWorking" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_72a40468c3924e43b934542e8e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_education" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "createdBy" character varying, "updatedBy" character varying, "deleted" boolean NOT NULL, "userId" uuid NOT NULL, "school" character varying NOT NULL, "degree" character varying NOT NULL, "fieldOfStudy" character varying NOT NULL, "grade" character varying NOT NULL, "activities" character varying, "description" character varying NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, CONSTRAINT "PK_a08c404d196df11dc034f077cf3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_experience" ADD CONSTRAINT "FK_7566e52259026584992211a40df" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_certification" ADD CONSTRAINT "FK_4e90ed5064cf1d34505e47ddd8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD CONSTRAINT "FK_b88a18e4faeea3bce60d70a4ae3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_education" ADD CONSTRAINT "FK_98f09242a36729ef251819d19a4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_education" DROP CONSTRAINT "FK_98f09242a36729ef251819d19a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" DROP CONSTRAINT "FK_b88a18e4faeea3bce60d70a4ae3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_certification" DROP CONSTRAINT "FK_4e90ed5064cf1d34505e47ddd8d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_experience" DROP CONSTRAINT "FK_7566e52259026584992211a40df"`,
    );
    await queryRunner.query(`DROP TABLE "user_education"`);
    await queryRunner.query(`DROP TABLE "user_project"`);
    await queryRunner.query(`DROP TABLE "user_certification"`);
    await queryRunner.query(`DROP TABLE "user_experience"`);
    await queryRunner.query(`DROP TYPE "public"."work_location_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."employment_type_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_accountstatus_enum"`);
  }
}

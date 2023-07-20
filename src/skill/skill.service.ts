import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillToUserDto } from './dto/create-skill-to-user.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillToUserEntity } from './entity/skill-to-user.entity';
import { SkillEntity } from './entity/skill.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly _skillRepo: Repository<SkillEntity>,
    @InjectRepository(SkillToUserEntity)
    private readonly _skillToUserRepo: Repository<SkillToUserEntity>,
  ) {}

  async createSkill(
    createSkillDto: CreateSkillDto,
    userId: string,
  ): Promise<SkillEntity> {
    const skill = this._skillRepo.create({
      ...createSkillDto,
      createdBy: userId,
    });

    await skill.save();

    return skill;
  }

  async getSkill({
    term,
    offset,
    limit,
  }: {
    term: string;
    offset: number;
    limit: number;
  }) {
    const resultArr = await this._skillRepo.query(
      `
        SELECT
        sk.name

        FROM
            skill sk

        WHERE sk."name" ILIKE ${term}::TEXT
            AND sk.deleted = false

        SKIP 
            ${offset}
        LIMIT
            ${limit}
        `,
    );

    return resultArr;
  }

  async deleteSkill({ id }: { id: string }) {
    return await this._skillRepo.delete({ id });
  }

  async addSkillToUser(
    { skillId, proficiency }: CreateSkillToUserDto,
    studentId: string,
  ): Promise<SkillToUserEntity> {
    const skillToUser = await this._skillToUserRepo.create({
      skillId,
      proficiency,
      userId: studentId,
    });

    await skillToUser.save();

    return skillToUser;
  }

  async removeUserSkill(ids: string[]) {
    return await this._skillToUserRepo.delete(ids);
  }
}

import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums';
import { UserHasRole } from 'src/decorators/user-has-role.decorator';
import { CreateSkillToUserDto } from './dto/create-skill-to-user.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillQueryDto } from './dto/skill-query.dto';
import { SkillToUserEntity } from './entity/skill-to-user.entity';
import { SkillEntity } from './entity/skill.entity';
import { SkillService } from './skill.service';

@Controller('api/skill')
@ApiTags('Skill')
export class SkillController {
  constructor(private readonly _skillServ: SkillService) {}

  @UserHasRole([UserRole.ADMIN, UserRole.STUDENT])
  @Get()
  async getSkills(
    @Query() { term, offset, limit }: SkillQueryDto,
    @Request() request: Express.Request,
  ): Promise<SkillEntity> {
    const user = (request as any).user;

    return await this._skillServ.getSkill({ term, offset, limit });
  }

  @UserHasRole([UserRole.ADMIN, UserRole.STUDENT])
  @Post()
  async createSkill(
    @Body() skillDto: CreateSkillDto,
    @Request() request: Express.Request,
  ): Promise<SkillEntity> {
    const user = (request as any).user;

    return await this._skillServ.createSkill(skillDto, user.id);
  }

  @Post('user')
  @UserHasRole([UserRole.STUDENT])
  async addUserSkill(
    @Body() skillToUserDto: CreateSkillToUserDto,
    @Request() request: Express.Request,
  ): Promise<SkillToUserEntity> {
    const user = (request as any).user;

    return await this._skillServ.addSkillToUser(skillToUserDto, user.id);
  }
}

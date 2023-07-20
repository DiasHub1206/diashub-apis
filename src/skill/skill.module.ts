import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillToUserEntity } from './entity/skill-to-user.entity';
import { SkillEntity } from './entity/skill.entity';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntity, SkillToUserEntity])],
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule {}

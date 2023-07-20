import { PlatformEntity } from 'src/common/entity/platform.entity';
import { SkillProficiency } from 'src/common/enums';
import { UserEntity } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { SkillEntity } from './skill.entity';

@Entity({ name: 'skill_to_user' })
@Unique(['userId', 'skillId'])
export class SkillToUserEntity extends PlatformEntity {
  @ManyToOne(() => SkillEntity, (skill) => skill.users, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  skill: SkillEntity;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  skillId: string;

  // many skills have one student
  @ManyToOne(() => UserEntity, (user) => user.userSkills, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @Column({
    type: 'enum',
    enumName: 'skill_proficiency_enum',
    enum: SkillProficiency,
  })
  proficiency: SkillProficiency;
}

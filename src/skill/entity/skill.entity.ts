import { PlatformEntity } from 'src/common/entity/platform.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { SkillToUserEntity } from './skill-to-user.entity';

@Entity({ name: 'skill' })
export class SkillEntity extends PlatformEntity {
  @Index()
  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  // one skill has many students
  @OneToMany(() => SkillToUserEntity, (skillToUser) => skillToUser.skill)
  users: SkillToUserEntity[];

  // only admin can add
  @Column({ type: 'uuid', nullable: false })
  createdBy: string;
}

import { PlatformEntity } from 'src/common/entity/platform.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_education' })
export class UserEducationEntity extends PlatformEntity {
  @ManyToOne(() => UserEntity, (user) => user.educations, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'varchar', nullable: false })
  school: string;

  @Column({ type: 'varchar', nullable: false })
  degree: string;

  @Column({ type: 'varchar', nullable: false })
  fieldOfStudy: string;

  @Column({ type: 'varchar', nullable: false })
  grade: string;

  @Column({ type: 'varchar', nullable: true })
  activities: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: false })
  endDate?: Date;
}

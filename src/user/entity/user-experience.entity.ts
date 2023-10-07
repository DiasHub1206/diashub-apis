import { PlatformEntity } from 'src/common/entity/platform.entity';
import { EmploymentType, WorkLocationType } from 'src/common/enums';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_experience' })
export class UserExperienceEntity extends PlatformEntity {
  @ManyToOne(() => UserEntity, (user) => user.experiences, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({
    type: 'enum',
    enum: EmploymentType,
    enumName: 'employment_type_enum',
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  companyName: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({
    type: 'enum',
    enum: WorkLocationType,
    enumName: 'work_location_type_enum',
    default: WorkLocationType.ON_SITE,
  })
  workLocationType: WorkLocationType;

  @Column({ type: 'boolean', default: false })
  isCurrentlyWorking: boolean;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'varchar', nullable: false })
  description: string;
}

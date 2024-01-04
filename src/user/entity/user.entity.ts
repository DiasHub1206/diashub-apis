import { PlatformEntity } from 'src/common/entity/platform.entity';
import { AccountStatus, UserRole } from 'src/common/enums';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserExperienceEntity } from './user-experience.entity';
import { UserEducationEntity } from './user-education.entity';
import { UserCertificationEntity } from './user-certification.entity';
import { UserProjectEntity } from './user-project.entity';
import { FileEntity } from 'src/asset/entity/file.entity';
import { SkillToUserEntity } from 'src/skill/entity/skill-to-user.entity';
import { FeedEntity } from 'src/feed/entity/feed.entity';

@Entity({ name: 'user' })
export class UserEntity extends PlatformEntity {
  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  mobileNumber: string;

  @Column({ type: 'varchar', nullable: true, default: '+91' })
  countryCode: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ type: 'varchar', nullable: true })
  shortInfo?: string;

  @Column({ type: 'varchar', nullable: true })
  about?: string;

  // github, leetcode etc
  @Column({ type: 'varchar', nullable: true })
  personalLink?: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.INACTIVE,
  })
  accountStatus: AccountStatus;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastActiveOn: Date;

  @Column({ type: 'uuid', nullable: true })
  profilePhotoId?: string;

  // one user has one profile photo
  @OneToOne(() => FileEntity, { eager: true, nullable: true })
  @JoinColumn()
  profilePhoto?: FileEntity;

  @OneToMany(() => UserExperienceEntity, (experience) => experience.user)
  experiences: UserExperienceEntity[];

  @OneToMany(() => UserEducationEntity, (education) => education.user)
  educations: UserEducationEntity[];

  @OneToMany(() => UserProjectEntity, (project) => project.user)
  projects: UserEducationEntity[];

  @OneToMany(() => SkillToUserEntity, (skill) => skill.user)
  userSkills: SkillToUserEntity[];

  @OneToMany(() => FeedEntity, (feed) => feed.user)
  feeds: FeedEntity[];

  @OneToMany(
    () => UserCertificationEntity,
    (certification) => certification.user,
  )
  certifications: UserEducationEntity[];

  @BeforeInsert() emailLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeUpdate() async hashPasswordOnUpdate() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

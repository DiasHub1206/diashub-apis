import { PlatformEntity } from 'src/common/entity/platform.entity';
import { AccountStatus, UserRole } from 'src/common/enums';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserExperienceEntity } from './user-experience.entity';
import { UserEducationEntity } from './user-education.entity';
import { UserCertificationEntity } from './user-certification.entity';
import { UserProjectEntity } from './user-project.entity';
import { FileEntity } from 'src/asset/entity/file.entity';

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

  @Column({ type: 'varchar', nullable: false })
  role: UserRole;

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

  @OneToMany(() => UserProjectEntity, (project) => project.user)
  profilePhoto: FileEntity;

  @OneToMany(() => UserExperienceEntity, (experience) => experience.user)
  experiences: UserExperienceEntity[];

  @OneToMany(() => UserEducationEntity, (education) => education.user)
  educations: UserEducationEntity[];

  @OneToMany(() => UserProjectEntity, (project) => project.user)
  projects: UserEducationEntity[];

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

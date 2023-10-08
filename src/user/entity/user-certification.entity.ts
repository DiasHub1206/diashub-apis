import { PlatformEntity } from 'src/common/entity/platform.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_certification' })
export class UserCertificationEntity extends PlatformEntity {
  @ManyToOne(() => UserEntity, (user) => user.certifications, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'varchar', nullable: false })
  organization: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  credentialId: string;

  @Column({ type: 'varchar', nullable: true })
  credentialUrl: string;

  @Column({ type: 'date', nullable: false })
  issueDate: Date;

  @Column({ type: 'date', nullable: false })
  expirationDate?: Date;
}

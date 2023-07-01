import { PlatformEntity } from 'src/common/entity/platform.entity';
import { AccountStatus } from 'src/common/enums';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'user' })
export class User extends PlatformEntity {
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

  @Column({ type: 'varchar', nullable: false })
  mobileNumber: string;

  @Column({ type: 'varchar', nullable: false, default: '+91' })
  countryCode: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.INACTIVE,
  })
  accountStatus: AccountStatus;

  @BeforeInsert() emailLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeUpdate() async hashPasswordOnUpdate() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

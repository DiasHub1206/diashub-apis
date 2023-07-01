import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 } from 'uuid';

export class PlatformEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
  @Column()
  public createdAt: Date;
  @Column()
  public updatedAt: Date;
  @Column({ nullable: true })
  public createdBy: string;
  @Column({ nullable: true })
  public updatedBy: string;
  @Column()
  public deleted: boolean;

  @BeforeInsert()
  async populateDetails(): Promise<void> {
    // const userContext = await getRequestContext();
    // this.id = v4();
    // this.createdAt = new Date();
    // this.updatedAt = new Date();
    // this.createdBy = userContext.userId;
    // this.updatedBy = userContext.userId;
    // this.deleted = false;
  }

  @BeforeUpdate()
  async populateUpdateDetails(): Promise<void> {
    // const userContext = await getRequestContext();
    // this.updatedAt = new Date();
    // this.updatedBy = userContext.userId;
  }
}

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
  @Column()
  public deleted: boolean;

  @BeforeInsert()
  async populateDetails(): Promise<void> {
    this.id = v4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deleted = false;
  }

  @BeforeUpdate()
  async populateUpdateDetails(): Promise<void> {
    this.updatedAt = new Date();
  }
}

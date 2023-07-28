import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { FeedEntity } from './feed.entity';

@Entity({ name: 'feed_like' })
@Unique(['feedId', 'userId'])
export class FeedLikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  feedId: string;

  @ManyToOne(() => FeedEntity, (feed) => feed.likes, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  feed: FeedEntity;
}

import { PlatformEntity } from 'src/common/entity/platform.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { FeedCommentEntity } from './feed-comment.entity';

@Entity({ name: 'comment_like' })
@Unique(['commentId', 'userId'])
export class CommentLikeEntity extends PlatformEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  commentId: string;

  @ManyToOne(() => FeedCommentEntity, (comment) => comment.likes, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comment: FeedCommentEntity;
}

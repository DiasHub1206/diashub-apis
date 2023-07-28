import { PlatformEntity } from 'src/common/entity/platform.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { CommentLikeEntity } from './comment-like.entity';
import { FeedEntity } from './feed.entity';

@Entity({ name: 'feed_comment' })
@Tree('closure-table')
export class FeedCommentEntity extends PlatformEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column({ type: 'uuid', nullable: false })
  feedId: string;

  @ManyToOne(() => FeedEntity, (feed) => feed.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  feed: FeedEntity;

  @OneToMany(() => CommentLikeEntity, (like) => like.comment)
  likes: CommentLikeEntity[];

  // nested comment loop
  @TreeChildren()
  children: FeedCommentEntity[];

  @TreeParent()
  parent: FeedCommentEntity;
}

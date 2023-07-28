import { PlatformEntity } from 'src/common/entity/platform.entity';
import { FeedVisibility } from 'src/common/enums';
import { UserEntity } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { FeedAssetInterface } from '../interface/feed-asset.interface';
import { FeedCommentEntity } from './feed-comment.entity';
import { FeedLikeEntity } from './feed-like.entity';

@Entity({ name: 'feed' })
export class FeedEntity extends PlatformEntity {
  @ManyToOne(() => UserEntity, (user) => user.feeds, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({
    type: 'enum',
    enumName: 'feed_visibility_enum',
    enum: FeedVisibility,
  })
  visibility: FeedVisibility;

  @Column({
    type: 'jsonb',
  })
  asset: FeedAssetInterface;

  @OneToMany(() => FeedCommentEntity, (comment) => comment.feed)
  comments: FeedCommentEntity[];

  @OneToMany(() => FeedLikeEntity, (likes) => likes.feed)
  likes: FeedLikeEntity[];
}

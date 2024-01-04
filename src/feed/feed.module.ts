import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AssetService } from 'src/asset/asset.service';
import { FileEntity } from 'src/asset/entity/file.entity';
import { editFileName } from 'src/common/utils';
import { CommentLikeEntity } from './entity/comment-like.entity';
import { FeedCommentEntity } from './entity/feed-comment.entity';
import { FeedLikeEntity } from './entity/feed-like.entity';
import { FeedEntity } from './entity/feed.entity';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedEntity,
      FeedCommentEntity,
      FeedLikeEntity,
      CommentLikeEntity,
      FileEntity,
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        return {
          storage: diskStorage({
            destination: path.resolve(path.join(__dirname, '../..', 'uploads')),
            filename: editFileName,
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [FeedController],
  providers: [FeedService, AssetService],
  exports: [FeedService],
})
export class FeedModule {}

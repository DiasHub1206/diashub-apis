import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetService } from 'src/asset/asset.service';
import { FileEntity } from 'src/asset/entity/file.entity';
import GCSUtils from 'src/common/gcs-utils';
import {
  DeleteResult,
  Repository,
  TreeRepository,
  UpdateResult,
} from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateFeedDto } from './dto/create-feed.dto';
import { EditFeedDto } from './dto/edit-feed.dto';
import { FeedCommentEntity } from './entity/feed-comment.entity';
import { FeedLikeEntity } from './entity/feed-like.entity';
import { FeedEntity } from './entity/feed.entity';
import { ConfigService } from '@nestjs/config';
import { CommentLikeEntity } from './entity/comment-like.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedEntity)
    private readonly _feedRepo: Repository<FeedEntity>,
    @InjectRepository(FeedCommentEntity)
    private readonly _commentRepo: TreeRepository<FeedCommentEntity>,
    @InjectRepository(FeedLikeEntity)
    private readonly _likeRepo: Repository<FeedLikeEntity>,
    @InjectRepository(CommentLikeEntity)
    private readonly _commentLikeRepo: Repository<CommentLikeEntity>,
    private readonly _assetServ: AssetService,
    private readonly _configServ: ConfigService,
  ) {}

  async createFeed({
    content,
    visibility,
    assets,
    userId,
  }: CreateFeedDto & {
    userId: string;
    assets?: Express.Multer.File[];
  }): Promise<FeedEntity> {
    const feedSavedTransaction = await this._feedRepo.manager.transaction(
      async (transaction) => {
        let savedFiles;
        if (assets?.length > 0) {
          const fileEntities = await this._assetServ.uploadAndSaveFiles(
            assets.map((file) => {
              return {
                file,
                type: ['image/jpeg', 'image/png', 'image/webp'].includes(
                  file.mimetype,
                )
                  ? 'image'
                  : 'video',
                metadata: {},
              };
            }),
            transaction,
          );

          savedFiles = fileEntities.map((file) => {
            return {
              fileId: file.id,
              filePath: file.name,
              assetType: file.type,
            };
          });
        }

        const feed = this._feedRepo.create({
          userId,
          content,
          visibility,
          asset: { asset: savedFiles },
        });

        return await transaction.save(feed);
      },
    );

    return feedSavedTransaction;
  }

  async findFeed(feedId: string, userId?: string): Promise<FeedEntity> {
    return await this._feedRepo.findOne({ where: { id: feedId, userId } });
  }

  async getFeedCount({
    userId,
  }: {
    userId?: string;
  }): Promise<{ count: number }> {
    const result = await this._feedRepo.count({
      where: { userId, deleted: false },
    });

    return { count: result };
  }

  async searchPost({
    limit,
    offset,
    userId,
  }: {
    limit: number;
    offset: number;
    userId?: string;
  }) {
    //todo: add comment and likes
    const resultArr = await this._feedRepo.query(
      `
      SELECT 
        feed."id" "id",
        feed."content" "content",
        feed."visibility" "visibility",
        feed."asset" "asset",
        feed."createdAt" "createdAt",
        feed."userId" "userId",
        u."firstName" "firstName",
        u."lastName" "lastName",
        u."profilePhotoId" "profilePhotoId",
        fl."likeCount" "likeCount"
        
      FROM feed 

      LEFT JOIN (
        SELECT
          COUNT(fl."id") "likeCount",
          fl."feedId" "feedId"

        FROM feed_like fl

        GROUP BY fl."feedId"
      ) fl
      ON fl."feedId" = feed."id"

      INNER JOIN "user" u
      ON u."id" = feed."userId"

      LEFT JOIN file profile_photo
      ON u."profilePhotoId" = profile_photo."id"

      WHERE feed."deleted" = false

      ${userId ? `AND feed."userId" = '${userId}'` : ``}

      ORDER BY feed."updatedAt" DESC

      LIMIT $1
      OFFSET $2
      `,
      [limit, offset],
    );

    try {
      for (let i = 0; i < resultArr.length; i++) {
        if (resultArr[i].asset.asset) {
          resultArr[i].asset = await Promise.all(
            resultArr[i].asset?.asset.map(async (i) => {
              const file = await GCSUtils.getInstance().generateV4ReadSignedUrl(
                this._configServ.get('GCS_BUCKET_NAME'),
                i.filePath,
              );
              return {
                ...i,
                filePath: file,
              };
            }),
          );
        }
      }
    } catch (error) {
      console.log(error);
    }

    return resultArr;
  }

  async getDetailedPost(id: string) {
    const resultArr = await this._feedRepo.query(
      `
      SELECT 
        feed."id" "id",
        feed."content" "content",
        feed."visibility" "visibility",
        feed."asset" "asset",
        feed."createdAt" "createdAt",
        feed."userId" "userId",
        u."firstName" "firstName",
        u."lastName" "lastName",
        u."profilePhotoId" "profilePhotoId",
        fl."likeCount" "likeCount"
        
      FROM feed 

      LEFT JOIN (
        SELECT
          COUNT(fl."id") "likeCount",
          fl."feedId" "feedId"

        FROM feed_like fl

        GROUP BY fl."feedId"
      ) fl
      ON fl."feedId" = feed."id"

      INNER JOIN "user" u
      ON u."id" = feed."userId"

      LEFT JOIN file profile_photo
      ON u."profilePhotoId" = profile_photo."id"

      WHERE feed."deleted" = false
      AND feed."id" = $1

      ORDER BY feed."updatedAt" DESC
      `,
      [id],
    );

    if (resultArr.length === 0) {
      throw new NotFoundException('Feed Not Found');
    }

    try {
      for (let i = 0; i < resultArr.length; i++) {
        if (resultArr[i].asset.asset) {
          resultArr[i].asset = await Promise.all(
            resultArr[i].asset?.asset.map(async (i) => {
              const file = await GCSUtils.getInstance().generateV4ReadSignedUrl(
                this._configServ.get('GCS_BUCKET_NAME'),
                i.filePath,
              );
              return {
                ...i,
                filePath: file,
              };
            }),
          );
        }
      }
    } catch (error) {
      console.log(error);
    }

    return resultArr[0];
  }

  async editFeed({
    content,
    visibility,
    assets,
    userId,
    feedId,
  }: EditFeedDto & {
    feedId: string;
    userId: string;
    assets?: Express.Multer.File[];
  }): Promise<UpdateResult> {
    const feedToEdit = await this.findFeed(feedId, userId);

    if (!feedToEdit) {
      throw new HttpException('Feed Not Found', HttpStatus.NOT_FOUND);
    }

    const feedSavedTransaction = await this._feedRepo.manager.transaction(
      async (transaction) => {
        let savedFiles;
        if (assets.length > 0) {
          const fileEntities = await this._assetServ.uploadAndSaveFiles(
            assets.map((file) => {
              return {
                file,
                type: ['image/jpeg', 'image/png', 'image/webp'].includes(
                  file.mimetype,
                )
                  ? 'image'
                  : 'video',
                metadata: {},
              };
            }),
            transaction,
          );

          savedFiles = fileEntities.map((file) => {
            return {
              fileId: file.id,
              filePath: file.name,
              assetType: file.type,
            };
          });
        }

        return await transaction.update(FeedEntity, feedId, {
          userId,
          content,
          visibility,
          asset: { asset: savedFiles },
        });
      },
    );

    return feedSavedTransaction;
  }

  async deleteFeed(userId, id): Promise<UpdateResult> {
    return await this._feedRepo.update({ userId, id }, { deleted: true });
  }

  async saveComment({
    feedId,
    userId,
    text,
    parentCommentId,
    image,
  }: CreateCommentDto & {
    userId: string;
    feedId: string;
    image?: Express.Multer.File;
  }): Promise<FeedCommentEntity> {
    //todo: handle parentCommentId
    const feed = await this._feedRepo.find({
      where: { id: feedId, deleted: false },
    });

    if (!feed) {
      throw new HttpException('Feed Not Found', HttpStatus.NOT_FOUND);
    }

    const comment = await this._commentRepo.manager.transaction(
      async (transaction) => {
        const comment = new FeedCommentEntity();
        comment.userId = userId;
        comment.feedId = feedId;
        comment.text = text;
        if (image) {
          const savedFiles = await this._assetServ.uploadAndSaveFiles(
            [
              {
                file: image,
                type: 'image',
                metadata: {},
              },
            ],
            transaction,
          )[0];

          comment.image = savedFiles.id;
        }
        let parentComment: FeedCommentEntity;

        if (parentCommentId) {
          parentComment = await this._commentRepo.findOne({
            where: { id: parentCommentId },
          });
          comment.parent = parentComment;
        }

        return await transaction.save(comment);
      },
    );

    return comment;
  }

  async getComment({
    feedId,
  }: {
    feedId: string;
  }): Promise<FeedCommentEntity[]> {
    return await this._commentRepo.findTrees({
      depth: 2,
      relations: ['likes'],
    });
  }

  async editComment({
    commentId,
    feedId,
    userId,
    text,
    parentCommentId,
    image,
  }: CreateCommentDto & {
    commentId: string;
    userId: string;
    feedId: string;
    image?: Express.Multer.File;
  }): Promise<FeedCommentEntity> {
    //todo: handle parentCommentId
    const feed = await this._feedRepo.find({
      where: { id: feedId, deleted: false },
    });

    if (!feed) {
      throw new HttpException('Feed Not Found', HttpStatus.NOT_FOUND);
    }

    const comment = await this._commentRepo.findOne({
      where: { id: commentId, userId },
    });

    if (!comment) {
      throw new HttpException('Comment Not Found', HttpStatus.NOT_FOUND);
    }

    await this._commentRepo.manager.transaction(async (transaction) => {
      let savedFiles: FileEntity;
      if (image) {
        savedFiles = await this._assetServ.uploadAndSaveFiles(
          [
            {
              file: image,
              type: 'image',
              metadata: {},
            },
          ],
          transaction,
        )[0];
      }

      let payload;

      if (savedFiles) {
        payload = {
          userId,
          feedId,
          text,
          imageId: savedFiles.id,
        };
      } else {
        payload = {
          userId,
          feedId,
          text,
        };
      }

      return await transaction.update(FeedCommentEntity, commentId, payload);
    });

    return comment;
  }

  async deleteComment({ userId, id, feedId }): Promise<DeleteResult> {
    const comment = await this._commentRepo.findOne({
      where: { userId, id, feedId },
    });

    if (!comment) {
      throw new HttpException('Comment Not Found', HttpStatus.NOT_FOUND);
    }

    return await this._commentRepo.delete(id);
  }

  async saveFeedLike({ feedId, userId }: { feedId: string; userId: string }) {
    const feed = await this._feedRepo.findOne({
      where: { id: feedId, deleted: false },
    });

    if (!feed) {
      throw new HttpException('Feed Not Found', HttpStatus.NOT_FOUND);
    }

    const like = this._likeRepo.create({
      feedId,
      userId,
    });

    await this._likeRepo.save(like).catch((error) => {
      console.log(error);
    });

    return like;
  }

  async removeFeedLike({ feedId, userId }: { feedId: string; userId: string }) {
    const feed = await this._feedRepo.findOne({
      where: { id: feedId, deleted: false },
    });

    if (!feed) {
      throw new HttpException('Feed Not Found', HttpStatus.NOT_FOUND);
    }

    const like = await this._likeRepo.findOne({ where: { feedId, userId } });

    return await this._likeRepo.delete(like.id);
  }

  async saveCommentLike({
    feedId,
    commentId,
    userId,
  }: {
    feedId: string;
    commentId: string;
    userId: string;
  }) {
    const comment = await this._commentRepo.findOne({
      where: { id: commentId, feedId, deleted: false },
    });

    if (!comment) {
      throw new HttpException('Comment Not Found', HttpStatus.NOT_FOUND);
    }

    const commentLike = this._commentLikeRepo.create({
      commentId,
      userId,
    });

    await this._commentLikeRepo.save(commentLike).catch((error) => {
      console.log(error);
    });

    return commentLike;
  }

  async removeCommentLike({
    feedId,
    commentId,
    userId,
  }: {
    feedId: string;
    commentId: string;
    userId: string;
  }) {
    const comment = await this._commentRepo.findOne({
      where: { id: commentId, feedId, deleted: false },
    });

    if (!comment) {
      throw new HttpException('Comment Not Found', HttpStatus.NOT_FOUND);
    }

    const commentLike = await this._commentLikeRepo.findOne({
      where: { commentId, userId },
    });

    return await this._commentLikeRepo.delete(commentLike.id);
  }
}

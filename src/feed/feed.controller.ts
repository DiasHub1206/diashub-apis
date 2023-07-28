import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Request,
  Patch,
  Param,
  Delete,
  Get,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { IdDto } from 'src/common/dto/id.dto';
import { ListItemsDto } from 'src/common/dto/list-items.dto';
import { UserRole } from 'src/common/enums';
import { feedFileFilter, imageFileFilter } from 'src/common/utils';
import { UserHasRole } from 'src/decorators/user-has-role.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateFeedDto } from './dto/create-feed.dto';
import { FeedCommentParamDto } from './dto/feed-comment-param.dto';
import { FeedCommentEntity } from './entity/feed-comment.entity';
import { FeedEntity } from './entity/feed.entity';
import { FeedService } from './feed.service';

@Controller('api/feed')
@ApiTags('Feed')
export class FeedController {
  constructor(private readonly _feedServ: FeedService) {}

  @UserHasRole([UserRole.STUDENT])
  @Get('search')
  async searchFeed(@Query() { limit, offset }: ListItemsDto) {
    return await this._feedServ.searchPost({ limit, offset });
  }
  @UserHasRole([UserRole.STUDENT])
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: feedFileFilter,
      limits: { files: 10 },
    }),
  )
  @Post()
  async createFeed(
    @UploadedFiles() assets: Express.Multer.File[],
    @Body() createFeed: CreateFeedDto,
    @Request() request: Express.Request,
  ): Promise<FeedEntity> {
    const result = await this._feedServ.createFeed({
      content: createFeed.content,
      visibility: createFeed.visibility,
      assets,
      userId: (request as any).user.id,
    });

    return result;
  }

  @UserHasRole([UserRole.STUDENT])
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: feedFileFilter,
      limits: { files: 10 },
    }),
  )
  @Patch(':id')
  async editFeed(
    @UploadedFiles() assets: Express.Multer.File[],
    @Param() { id }: IdDto,
    @Body() createFeed: CreateFeedDto,
    @Request() request: Express.Request,
  ): Promise<UpdateResult> {
    const result = await this._feedServ.editFeed({
      content: createFeed.content,
      visibility: createFeed.visibility,
      assets,
      userId: (request as any).user.id,
      feedId: id,
    });

    return result;
  }

  @UserHasRole([UserRole.STUDENT])
  @Delete(':id')
  async deleteFeed(
    @Param() { id }: IdDto,
    @Request() request: Express.Request,
  ): Promise<DeleteResult> {
    return await this._feedServ.deleteFeed((request as any).user.id, id);
  }

  @UserHasRole([UserRole.STUDENT])
  @Post(':id/like')
  async saveFeedLike(
    @Param() { id: feedId }: IdDto,
    @Request() request: Express.Request,
  ) {
    return await this._feedServ.saveFeedLike({
      feedId,
      userId: (request as any).user.id,
    });
  }

  @UserHasRole([UserRole.STUDENT])
  @Delete(':id/like')
  async removeLike(
    @Param() { id: feedId }: IdDto,
    @Request() request: Express.Request,
  ): Promise<DeleteResult> {
    return await this._feedServ.removeFeedLike({
      userId: (request as any).user.id,
      feedId,
    });
  }

  @UserHasRole([UserRole.STUDENT])
  @Get(':id/comment')
  async getComment(
    @Param() { id: feedId }: IdDto,
  ): Promise<FeedCommentEntity[]> {
    return await this._feedServ.getComment({ feedId });
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image'],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { files: 1, fileSize: 4572864 }, // 4.5 mb
      fileFilter: imageFileFilter,
    }),
  )
  @UserHasRole([UserRole.STUDENT])
  @Post(':id/comment')
  async saveComment(
    @UploadedFile() image: Express.Multer.File,
    @Param() { id }: IdDto,
    @Request() request: Express.Request,
    @Body() { text, parentCommentId }: CreateCommentDto,
  ) {
    return await this._feedServ.saveComment({
      feedId: id,
      userId: (request as any).user.id,
      text,
      parentCommentId,
      image,
    });
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image'],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { files: 1, fileSize: 4572864 }, // 4.5 mb
      fileFilter: imageFileFilter,
    }),
  )
  @UserHasRole([UserRole.STUDENT])
  @Patch(':id/comment/:commentId')
  async editComment(
    @UploadedFile() image: Express.Multer.File,
    @Param() { id: feedId, commentId }: FeedCommentParamDto,
    @Request() request: Express.Request,
    @Body() { text, parentCommentId }: CreateCommentDto,
  ) {
    return await this._feedServ.editComment({
      feedId,
      commentId,
      userId: (request as any).user.id,
      text,
      parentCommentId,
      image,
    });
  }

  @UserHasRole([UserRole.STUDENT])
  @Delete(':id/comment/:commentId')
  async deleteComment(
    @Param() { id: feedId, commentId }: FeedCommentParamDto,
    @Request() request: Express.Request,
  ): Promise<DeleteResult> {
    return await this._feedServ.deleteComment({
      userId: (request as any).user.id,
      id: commentId,
      feedId,
    });
  }

  @UserHasRole([UserRole.STUDENT])
  @Post(':id/comment/:commentId/like')
  async saveCommentLike(
    @Param() { id: feedId, commentId }: FeedCommentParamDto,
    @Request() request: Express.Request,
  ) {
    return await this._feedServ.saveCommentLike({
      feedId,
      commentId,
      userId: (request as any).user.id,
    });
  }

  @UserHasRole([UserRole.STUDENT])
  @Delete(':id/comment/:commentId/like')
  async removeCommentLike(
    @Param() { id: feedId, commentId }: FeedCommentParamDto,
    @Request() request: Express.Request,
  ): Promise<DeleteResult> {
    return await this._feedServ.removeCommentLike({
      feedId,
      commentId,
      userId: (request as any).user.id,
    });
  }
}

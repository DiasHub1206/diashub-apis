import { IsNotEmpty, IsUUID } from 'class-validator';

export class FeedCommentParamDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsUUID()
  @IsNotEmpty()
  commentId: string;
}

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FeedVisibility } from 'src/common/enums';

export class CreateFeedDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(FeedVisibility)
  visibility: FeedVisibility;
}

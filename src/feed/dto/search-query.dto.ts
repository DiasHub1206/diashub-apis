import { IsOptional, IsString } from 'class-validator';
import { ListItemsDto } from 'src/common/dto/list-items.dto';

export class SearchQueryDto extends ListItemsDto {
  @IsOptional()
  @IsString()
  userId?: string;
}

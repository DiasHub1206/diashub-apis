import { IsOptional, IsString } from 'class-validator';
import { ListItemsDto } from 'src/common/dto/list-items.dto';

export class SkillQueryDto extends ListItemsDto {
  @IsOptional()
  @IsString()
  term?: string;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { ListItemsDto } from 'src/common/dto/list-items.dto';

export class SkillQueryDto extends ListItemsDto {
  @IsNotEmpty()
  @IsString()
  term: string;
}

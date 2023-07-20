import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { SkillProficiency } from 'src/common/enums';

export class CreateSkillToUserDto {
  @IsNotEmpty()
  @IsUUID()
  skillId: string;

  @IsEnum(SkillProficiency)
  @IsNotEmpty()
  proficiency: SkillProficiency;
}

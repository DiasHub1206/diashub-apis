import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EmploymentType, WorkLocationType } from 'src/common/enums';

export class AddUserExperienceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @IsNotEmpty()
  @IsEnum(WorkLocationType)
  workLocationType: WorkLocationType;

  @IsNotEmpty()
  @IsBoolean()
  isCurrentlyWorking: boolean;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsNotEmpty()
  @IsString()
  description: string;
}

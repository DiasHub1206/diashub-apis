import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateUserProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  isCurrentlyWorking?: boolean;
}

import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateUserCertificationDto {
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  credentialId?: string;

  @IsOptional()
  @IsString()
  credentialUrl?: string;

  @IsOptional()
  @IsDate()
  issueDate?: Date;

  @IsOptional()
  @IsDate()
  expirationDate?: Date;
}

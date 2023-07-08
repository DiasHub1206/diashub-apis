import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddUserCertificationDto {
  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  credentialId?: string;

  @IsOptional()
  @IsString()
  credentialUrl?: string;

  @IsNotEmpty()
  @IsDate()
  issueDate: Date;

  @IsNotEmpty()
  @IsDate()
  expirationDate: Date;
}

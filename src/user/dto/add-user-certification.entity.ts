import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddUserCertificationDto {
  @IsNotEmpty()
  @IsString()
  organization: string;

  @IsNotEmpty()
  @IsString()
  name: string;

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

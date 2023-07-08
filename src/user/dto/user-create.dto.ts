import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  @Transform(({ value }) =>
    // Remove space at the start&end, then replace multiple spaces with a single space
    value.trim().replace(/\s\s+/g, ' '),
  )
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  @Transform(({ value }) =>
    // Remove space at the start&end, then replace multiple spaces with a single space
    value.trim().replace(/\s\s+/g, ' '),
  )
  lastName: string;

  @IsNotEmpty()
  @IsString()
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  countryCode: string;
}

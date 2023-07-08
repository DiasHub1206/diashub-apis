import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { IsAllowedEmail } from '../../validators/is-allowed-email.validator';
import { CustomRegex } from '../../common/custom-regex';
import { UserRole } from 'src/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class SignupPostBodyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  @ApiProperty()
  @Transform(({ value }) =>
    // Remove space at the start&end, then replace multiple spaces with a single space
    value.trim().replace(/\s\s+/g, ' '),
  )
  @Matches(CustomRegex.USER_REAL_NAME_PATTERN)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(250)
  @IsString()
  @ApiProperty()
  @Transform(({ value }) =>
    // Remove space at the start&end, then replace multiple spaces with a single space
    value.trim().replace(/\s\s+/g, ' '),
  )
  @Matches(CustomRegex.USER_REAL_NAME_PATTERN)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsAllowedEmail()
  email: string;

  @IsNotEmpty()
  @IsIn([UserRole.STUDENT, UserRole.ADMIN])
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  password: string;
}

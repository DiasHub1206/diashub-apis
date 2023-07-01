import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AccountStatus, UserRole } from 'src/common/enums';

export class UserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  profilePhoto: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsEnum(AccountStatus)
  accountStatus?: AccountStatus;
}

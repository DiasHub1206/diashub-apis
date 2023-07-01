import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/enums';

export const USER_HAS_ROLE_DEC_KEY = 'userHasRole';
export const UserHasRole = (roles: UserRole[]) =>
  SetMetadata(USER_HAS_ROLE_DEC_KEY, roles);

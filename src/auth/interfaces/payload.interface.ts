import { UserRole } from 'src/common/enums';

export interface JwtPayload {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  accessToken: string;
  expiresIn: string | number;
}

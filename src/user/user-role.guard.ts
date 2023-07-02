import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/common/enums';
import { USER_HAS_ROLE_DEC_KEY } from 'src/decorators/user-has-role.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // check to see if userRole(..) decorator is present
    const userRoleDec = this._reflector.getAllAndOverride<UserRole[]>(
      USER_HAS_ROLE_DEC_KEY,
      [context.getHandler(), context.getClass()],
    );

    // if decorator is not present, pass
    if (!userRoleDec) return true;

    // check to see user role
    const { user } = context.switchToHttp().getRequest();

    if (!user) return false;

    if (userRoleDec.includes(user.role)) {
      return true;
    }

    return false;
  }
}

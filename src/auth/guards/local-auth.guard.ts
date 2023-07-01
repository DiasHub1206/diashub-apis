import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserEntityType } from 'src/common/types';
import { ALLOW_UNVERIFIED_DEC_KEY } from 'src/decorators/allow-unverified.decorator';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly _reflector: Reflector) {
    super();
  }

  handleRequest<TUser = any>(
    err: any,
    user: UserEntityType | undefined,
    info: any,
    context: any,
    status?: any,
  ): TUser {
    // check to see if AllowUnverified() decorator is not present
    const allowUnverifiedDec = this._reflector.getAllAndOverride<boolean>(
      ALLOW_UNVERIFIED_DEC_KEY,
      [context.getHandler(), context.getClass()],
    );

    /**
     * If AllowUnverified() decorator is not present, check if user is verified,
     * if the user is not verified deny access.
     */
    // if (!allowUnverifiedDec) {
    //   if (user?.emailStatus === EmailStatus.UNVERIFIED)
    //     throw new UnauthorizedException();
    // }

    return super.handleRequest(err, user, info, context, status);
  }
}

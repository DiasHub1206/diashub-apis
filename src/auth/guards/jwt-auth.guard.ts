import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOW_UNVERIFIED_DEC_KEY } from 'src/decorators/allow-unverified.decorator';
import { ONLY_LOGGED_OUT_DEC_KEY } from 'src/decorators/only-logged-out.decorator';
import { PUBLIC_DEC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly _reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // check to see if public() decorator is present
    const publicDec = this._reflector.getAllAndOverride<boolean>(
      PUBLIC_DEC_KEY,
      [context.getHandler(), context.getClass()],
    );

    return (<Promise<boolean>>super.canActivate(context))
      .then((v) => {
        return v;
      })
      .catch(() => {
        // if public() decorator is present, always return true
        if (publicDec) return true;

        return false;
      });
  }

  handleRequest(err, user, info, context) {
    // check to see if OnlyLoggedOut() decorator is present
    const onlyLoggedOutDec = this._reflector.getAllAndOverride<boolean>(
      ONLY_LOGGED_OUT_DEC_KEY,
      [context.getHandler(), context.getClass()],
    );

    /**
     * If OnlyLoggedOut() decorator is present, check if user is logged in,
     * if the user is logged in deny access, else return null
     */
    if (onlyLoggedOutDec) {
      if (user) throw new UnauthorizedException();
      return null;
    }

    return super.handleRequest(err, user, info, context);
  }
}

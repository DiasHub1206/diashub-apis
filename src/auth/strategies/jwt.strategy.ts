import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/payload.interface';

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) token = req.cookies['access-token'];
  console.log('cookies check', JSON.stringify(req.cookies));
  if (token) {
    return token.accessToken;
  } else {
    token = req.headers?.authorization?.split(' ');
    if (token && token.length) return token[1];
  }
  return;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configServ: ConfigService,
    private readonly _authServ: AuthService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: _configServ.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    const user = await this._authServ.validateUserJwt(payload);

    return user;
  }
}

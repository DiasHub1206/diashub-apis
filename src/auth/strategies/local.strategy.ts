import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntityType } from 'src/common/types';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authServ: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<UserEntityType> {
    const user = await this._authServ.validateUser(username, password);
    return user;
  }
}

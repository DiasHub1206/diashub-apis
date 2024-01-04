import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignupPostBodyDto } from 'src/user/dto/signup-post-body.dto';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { JwtService } from '@nestjs/jwt';
import { UserEntityType } from 'src/common/types';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/entity/user.entity';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly _configServ: ConfigService,
    private readonly _userServ: UserService,
    private readonly _jwtServ: JwtService,
  ) {}

  async register(userDto: SignupPostBodyDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      await this._userServ.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }

    return status;
  }

  /**
   * Logs user in
   *
   * @param {UserEntityType} user
   * @returns {Promise<JwtPayload>}
   * @memberof AuthService
   */
  async login(req: Request, res: Response): Promise<any> {
    // generate and sign a Jwt token
    const { user } = req as any;

    const token = this._createJwtToken(user);

    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + 1);

    // need to define domain
    const cookieDomains =
      req.hostname === 'localhost'
        ? ['localhost']
        : [
            process.env.WEB_APP_DOMAIN,
            '',
            'diashub-apis-3qmisfeijq-el.a.run.app',
          ];

    cookieDomains.forEach((d) => {
      res.cookie('access-token', token, {
        expires: expiresIn,
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'none',
        domain: d,
      });
    });

    return res.json({
      // ...token,
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });

    // return an object that contains the Jwt signed token & optional data
  }

  /**
   * Returns Jwt token object which contains an access token and optional data
   *
   * @private
   * @param {UserDto} { username }
   * @returns
   * @memberof AuthService
   */
  private _createJwtToken(user: UserEntity) {
    // get jwt expiration time
    const expiresIn = this._configServ.get('JWT_SESSION_EXPIRES_IN');

    // define a payload to be signed
    const payload: Partial<JwtPayload> = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // get an access token by signing the payload
    const accessToken = this._jwtServ.sign(payload);

    // return an object that contains the access token & optional data
    return {
      expiresIn,
      accessToken,
    };
  }

  async validateUser(email: string, password: string): Promise<UserEntityType> {
    // get user by passing the email
    const user = await this._userServ.findOne({
      where: { email },
    });

    // if user is not found throw unauthorized exception
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords

    const areEqual = await bcrypt.compare(password, user.password);

    // if the credentials are not valid throw unauthorized exception
    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // return user
    return user;
  }

  async validateUserJwt(payload: JwtPayload): Promise<UserEntity> {
    // get user by passing Jwt payload
    const user = await this._userServ.findByPayload(payload);

    // if user is not found throw unauthorized exception
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    await this._userServ.updateLastActiveOn({ id: user.id });
    // return user
    return user;
  }
}

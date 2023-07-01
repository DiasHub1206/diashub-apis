import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountStatus } from 'src/common/enums';
import { SignupPostBodyDto } from 'src/user/dto/signup-post-body.dto';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { JwtService } from '@nestjs/jwt';
import { UserEntityType } from 'src/common/types';
import { LoginUserDto } from 'src/user/dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';

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
  async login(userLogin: LoginUserDto): Promise<JwtPayload> {
    // if account is inactive & email is verified, activate the account
    // if (user.accountStatus === AccountStatus.INACTIVE) {
    //   await this._userServ.setAccountActive(user.id);
    // }

    const user = await this._userServ.findOne({
      where: { email: userLogin.email },
    });

    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    if (await bcrypt.compare(userLogin.password, user.password)) {
      // generate and sign a Jwt token
      const token = this._createJwtToken(user);
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        ...token,
      };
    }
    throw new HttpException('Wrong Password', HttpStatus.UNAUTHORIZED);

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
  private _createJwtToken({ username }: any) {
    // get jwt expiration time
    const expiresIn = this._configServ.get('JWT_SESSION_EXPIRES_IN');

    // define a payload to be signed
    const payload: Partial<JwtPayload> = { username };

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

  async validateUserJwt(payload: JwtPayload): Promise<User> {
    // get user by passing Jwt payload
    const user = await this._userServ.findByPayload(payload);

    // if user is not found throw unauthorized exception
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    // return user
    return user;
  }
}

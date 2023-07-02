import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserEntityType } from 'src/common/types';
import { AllowUnverified } from 'src/decorators/allow-unverified.decorator';
import { OnlyLoggedOut } from 'src/decorators/only-logged-out.decorator';
import { SignupPostBodyDto } from 'src/user/dto/signup-post-body.dto';
import { LoginUserDto } from 'src/user/dto/user-login.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly _authServ: AuthService) {}

  @OnlyLoggedOut()
  @Post('register')
  public async register(
    @Body() signupPostBodyDto: SignupPostBodyDto,
  ): Promise<RegistrationStatus> {
    // register a new user
    const result: RegistrationStatus = await this._authServ.register(
      signupPostBodyDto,
    );

    /**
     * NOTE: No need to wait for this, if it fails, the token can be re-issued later
     */
    // generate and send new token to verify user email

    // if the user was not registered successfully throw a BAD_REQUEST exception
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    // return the result object
    return result;
  }

  /**
   * Logs user in with credentials and returns jwt payload as a response
   *
   * [1] allows only unauthenticated users
   *
   * [2] allows users with unverified emails
   *
   * [3] guards this route with a localAuthGuard that uses local strategy
   *  to vaildate user credentials (e.g. email, password)
   *
   * @param {*} { user }
   * @returns {Promise<JwtPayload>}
   * @memberof AuthController
   */
  @OnlyLoggedOut() // [1]
  @AllowUnverified() // [2]
  @UseGuards(LocalAuthGuard) // [2]
  @Post('login')
  public async login(
    @Req() { user }: { user: UserEntityType },
  ): Promise<JwtPayload> {
    // log in with user credentials and return jwt payload
    return this._authServ.login(user);
  }
}

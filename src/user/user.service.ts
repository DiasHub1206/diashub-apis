import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  FindOneOptions,
  getManager,
  ILike,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { SignupPostBodyDto } from './dto/signup-post-body.dto';
import { User } from './entity/user.entity';
import slugify from 'slugify';
import { countUsersWithUsernamePrefixQfn } from './query/count-users-with-username-prefix.qfn';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStatus } from 'src/common/enums';
import { UserEntityType } from 'src/common/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _user: Repository<User>,
  ) {}
  async create(userDto: SignupPostBodyDto): Promise<User> {
    const { firstName, lastName, email, password, role } = userDto;

    // const userInDb = await this._user.query(
    //   `SELECT
    //     u."id" id,
    //     u."email" email

    //     FROM "user" u
    //     WHERE u."email" = $1

    //     `[email],
    // );

    const userInDb = await this._user.find({ where: { email } });

    // if user exists throw bad request as duplicate users are not allowed
    if (userInDb.length > 0) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // extract email's username part
    const usernamePart = email.split('@')[0];

    // generate username (lowercase, no special charachters) from email username
    let username = slugify(usernamePart, { lower: true, strict: true });

    /**
     * We need to ensure username is unique across student & teacher tables
     */

    // count the number of users whose username is similar to the generated username
    const count = await this._user.count({
      where: { username: ILike(username) },
    });

    /* If at least one user has the same username, add current user's order
     * surrounded by two single digit random numbers to get a unique username
     */
    if (count) {
      username += `${Math.ceil(Math.random() * 10)}${count + 1}${Math.ceil(
        Math.random() * 10,
      )}`;
    }

    // create a new user entity depending on user role
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.email = email;
    user.password = password;
    user.accountStatus = AccountStatus.ACTIVE;
    user.role = role;
    // const user = this._user.create({
    //   accountStatus: AccountStatus.INACTIVE,
    //   firstName,
    //   lastName,
    //   username,
    //   email,
    //   password,
    // });

    // save the new user to db
    await user.save();

    // return user
    return user;
  }

  async setAccountActive(id: string): Promise<boolean> {
    const user = await this._user.findOne({ where: { id } });

    user.accountStatus = AccountStatus.ACTIVE;

    await user.save();
    return true;
  }

  async findOne(
    options?: FindOneOptions<UserEntityType>,
  ): Promise<UserEntityType> {
    if ((<ObjectLiteral>options.where).email) {
      // eslint-disable-next-line no-param-reassign
      (<ObjectLiteral>options.where).email = (<ObjectLiteral>(
        options.where
      )).email.toLowerCase();
    }

    // TODO: use a single query to search in user tables (student, teacher)
    const user: UserEntityType = await this._user.findOne(options);

    return user;
  }

  async findByPayload({ username }): Promise<UserEntityType> {
    return this.findOne({ where: { username } });
  }
}

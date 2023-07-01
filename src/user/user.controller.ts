import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/auth/decorator/auth.decorator';
import { IdDto } from 'src/common/dto/id.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('api/user')
@ApiTags('User')
@UserAuth()
@ApiBearerAuth()
export class UserController {
  constructor(private readonly _userServ: UserService) {}

  @Get(':id')
  async getById(@Param() { id: userId }: IdDto): Promise<User> {
    return await this._userServ.findOne({ where: { id: userId } });
  }
}

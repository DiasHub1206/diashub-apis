import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdDto } from 'src/common/dto/id.dto';
import { UserRole } from 'src/common/enums';
import { UserHasRole } from 'src/decorators/user-has-role.decorator';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('api/user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly _userServ: UserService) {}

  @UserHasRole([UserRole.STUDENT, UserRole.ADMIN])
  @Get(':id')
  async getById(@Param() { id: userId }: IdDto): Promise<User> {
    return await this._userServ.findOne({ where: { id: userId } });
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdDto } from 'src/common/dto/id.dto';
import { UserRole } from 'src/common/enums';
import { UserHasRole } from 'src/decorators/user-has-role.decorator';
import { AddUserCertificationDto } from './dto/add-user-certification.entity';
import { AddUserProjectDto } from './dto/add-user-project.entity';
import { AddUserEducationDto } from './dto/add-user-education.dto';
import { AddUserExperienceDto } from './dto/add-user-experience.dto';
import { UpdateUserEducationDto } from './dto/update-user-education.dto';
import { UpdateUserExperienceDto } from './dto/update-user-experience.dto';
import { UserCertificationEntity } from './entity/user-certification.entity';
import { UserEducationEntity } from './entity/user-education.entity';
import { UserExperienceEntity } from './entity/user-experience.entity';
import { UserProjectEntity } from './entity/user-project.entity';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { UpdateUserProjectDto } from './dto/update-user-project.entity';
import { UpdateUserCertificationDto } from './dto/update-user-certification.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult } from 'typeorm';

@Controller('api/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly _userServ: UserService) {}

  @UserHasRole([UserRole.STUDENT, UserRole.ADMIN])
  @Get(':id')
  async getById(@Param() { id: userId }: IdDto): Promise<UserEntity> {
    return await this._userServ.findOne({ where: { id: userId } });
  }

  @UserHasRole([UserRole.STUDENT, UserRole.ADMIN])
  @Get('me/profile-setting')
  async getUserProfile(
    @Request() request: Express.Request,
  ): Promise<UserEntity> {
    return await this._userServ.getUserDetails((request as any).user.id);
  }

  @UserHasRole([UserRole.STUDENT])
  @Patch('me/profile-settings')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() request: Express.Request,
  ): Promise<boolean> {
    return await this._userServ.update((request as any).user.id, updateUserDto);
  }

  @UserHasRole([UserRole.STUDENT, UserRole.ADMIN])
  @Get(':id/public-profile')
  async getUserPublicDetails(
    @Param() { id: userId }: IdDto,
  ): Promise<UserEntity> {
    const result = await this._userServ.getUserPublicDetails(userId);

    if (!result) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  @UserHasRole([UserRole.STUDENT])
  @Post('me/experience')
  async createUserExperience(
    @Body() userExperienceDto: AddUserExperienceDto,
    @Request() request: Express.Request,
  ): Promise<UserExperienceEntity> {
    const userId = (request as any).user.id;

    return await this._userServ.createUserExperience(userId, userExperienceDto);
  }

  @UserHasRole([UserRole.STUDENT])
  @Patch('me/experience/:id')
  async updateUserExperience(
    @Param() { id }: IdDto,
    @Body() userExperienceDto: UpdateUserExperienceDto,
    @Request() request: Express.Request,
  ): Promise<boolean> {
    const userId = (request as any).user.id;

    return await this._userServ.updateUserExperience(
      id,
      userId,
      userExperienceDto,
    );
  }

  @UserHasRole([UserRole.STUDENT])
  @Delete('me/experience/:id')
  async deleteUserExperience(
    @Param() { id }: IdDto,
    @Request() request: Express.Request,
  ): Promise<DeleteResult> {
    const userId = (request as any).user.id;

    return await this._userServ.deleteUserExperience(id, userId);
  }

  @UserHasRole([UserRole.STUDENT])
  @Post('me/education')
  async createUserEducation(
    @Body() userEducationDto: AddUserEducationDto,
    @Request() request: Express.Request,
  ): Promise<UserEducationEntity> {
    const userId = (request as any).user.id;

    return await this._userServ.createUserEducation(userId, userEducationDto);
  }

  @UserHasRole([UserRole.STUDENT])
  @Patch('me/education/:id')
  async updateUserEducation(
    @Param() { id }: IdDto,
    @Body() userEducationDto: UpdateUserEducationDto,
    @Request() request: Express.Request,
  ): Promise<boolean> {
    const userId = (request as any).user.id;

    return await this._userServ.updateUserEducation(
      id,
      userId,
      userEducationDto,
    );
  }

  @UserHasRole([UserRole.STUDENT])
  @Delete('me/education/:id')
  async deleteUserEducation(
    @Param() { id }: IdDto,
    @Request() request: Express.Request,
  ): Promise<DeleteResult> {
    const userId = (request as any).user.id;

    return await this._userServ.deleteUserEducation(id, userId);
  }

  @UserHasRole([UserRole.STUDENT])
  @Post('me/project')
  async createUserProject(
    @Body() userProjectDto: AddUserProjectDto,
    @Request() request: Express.Request,
  ): Promise<UserProjectEntity> {
    const userId = (request as any).user.id;

    return await this._userServ.createUserProject(userId, userProjectDto);
  }

  @UserHasRole([UserRole.STUDENT])
  @Patch('me/project/:id')
  async updateUserProject(
    @Param() { id }: IdDto,
    @Body() userProjectDto: UpdateUserProjectDto,
    @Request() request: Express.Request,
  ): Promise<boolean> {
    const userId = (request as any).user.id;

    return await this._userServ.updateUserProject(id, userId, userProjectDto);
  }

  @UserHasRole([UserRole.STUDENT])
  @Delete('me/project/:id')
  async deleteUserProject(
    @Param() { id }: IdDto,
    @Request() request: Express.Request,
  ): Promise<DeleteResult> {
    const userId = (request as any).user.id;

    return await this._userServ.deleteUserProject(id, userId);
  }

  @UserHasRole([UserRole.STUDENT])
  @Post('me/certification')
  async createUserCertification(
    @Body() userCertificationDto: AddUserCertificationDto,
    @Request() request: Express.Request,
  ): Promise<UserCertificationEntity> {
    const userId = (request as any).user.id;

    return await this._userServ.createUserCertification(
      userId,
      userCertificationDto,
    );
  }

  @UserHasRole([UserRole.STUDENT])
  @Patch('me/certification/:id')
  async updateUserCertification(
    @Param() { id }: IdDto,
    @Body() userCertificationDto: UpdateUserCertificationDto,
    @Request() request: Express.Request,
  ): Promise<boolean> {
    const userId = (request as any).user.id;

    return await this._userServ.updateUserCertification(
      id,
      userId,
      userCertificationDto,
    );
  }

  @UserHasRole([UserRole.STUDENT])
  @Delete('me/certification/:id')
  async deleteUserCertification(
    @Param() { id }: IdDto,
    @Request() request: Express.Request,
  ): Promise<DeleteResult> {
    const userId = (request as any).user.id;

    return await this._userServ.deleteUserCertification(id, userId);
  }
}

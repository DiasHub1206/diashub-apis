import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCertificationEntity } from './entity/user-certification.entity';
import { UserEducationEntity } from './entity/user-education.entity';
import { UserExperienceEntity } from './entity/user-experience.entity';
import { UserProjectEntity } from './entity/user-project.entity';
import { UserEntity } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserExperienceEntity,
      UserEducationEntity,
      UserProjectEntity,
      UserCertificationEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
